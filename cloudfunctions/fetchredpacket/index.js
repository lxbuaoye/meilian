// cloudfunctions/claimRedPacket/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV, // 或者指定你的环境ID
});

const db = cloud.database();
const _ = db.command; // 用于原子操作

/**
 * 加权随机选择函数
 * @param {Array<Object>} prizeTypes - 红包类型数组，每个对象需包含 weight 属性
 * @returns {Object|null} 选中的红包类型对象，如果权重计算有问题则返回null
 */
function weightedRandomDraw(prizeTypes) {
  let totalWeight = 0;
  for (const type of prizeTypes) {
    if (type.weight > 0) {
      // 只考虑权重大于0的类型
      totalWeight += type.weight;
    }
  }

  if (totalWeight <= 0) {
    return null; // 没有可供选择的类型
  }

  const randomNumber = Math.random() * totalWeight; // 生成一个 0 到 totalWeight 之间的随机数
  let cumulativeWeight = 0;

  for (const type of prizeTypes) {
    if (type.weight > 0) {
      cumulativeWeight += type.weight;
      if (randomNumber < cumulativeWeight) {
        return type; // 找到了选中的类型
      }
    }
  }
  return null; // 理论上不应该到达这里
}

exports.main = async (event, context) => {
  const { campaignId, phoneNumber } = event; // 从前端接收活动ID和用户ID
  const wxContext = cloud.getWXContext(); // 获取微信上下文

  // 确保用户ID存在
  if (!phoneNumber) {
    // 或者使用 wxContext.OPENID 如果你只需要微信用户ID
    return { success: false, message: '用户ID缺失' };
  }

  // 0. 启动数据库事务
  const transaction = await db.startTransaction();

  try {
    //  1. 检查用户是否已领取过该红包活动
    const existingRecord = await transaction
      .collection('user_red_packet')
      .where({
        user: phoneNumber,
        campaignId: campaignId,
      })
      .count(); // 使用 count() 来检查是否存在记录

    if (existingRecord.total > 0) {
      // 如果 total 大于 0，说明用户已经领取过
      throw new Error('您已领取过该红包，请勿重复领取！');
    }

    // 2. 获取红包活动详情 (在事务中读取，确保数据新鲜)
    const campaignRes = await transaction.collection('red_packet').doc(campaignId).get();

    if (!campaignRes.data) {
      throw new Error('红包活动不存在');
    }

    const campaign = campaignRes.data;
    const now = new Date();

    // 3. 检查活动资格和库存
    if (campaign.status !== 'ACTIVE') {
      throw new Error('红包活动未开始、已结束或已暂停');
    }
    if (now < campaign.startTime || now > campaign.endTime) {
      throw new Error('红包活动不在进行时间范围内');
    }
    if (campaign.issuedCount >= campaign.totalQuantity) {
      throw new Error('红包已发完，请下次再来');
    }

    // 4. 执行加权随机选择
    const selectedPrizeType = weightedRandomDraw(campaign.types);

    if (!selectedPrizeType) {
      throw new Error('没有可供选择的红包类型');
    }

    // 5. 原子性更新活动总库存 (核心并发控制)
    // 条件：totalQuantity > issuedCount (防止超发)
    // 原子操作：issuedCount 增加 1
    const updateCampaignRes = await transaction
      .collection('red_packet')
      .doc(campaignId)
      .update({
        data: {
          issuedCount: _.inc(1), // 原子递增已发数量
        },
        query: {
          // 确保未超发
          totalQuantity: _.gt(campaign.issuedCount), // 只有当总数量大于当前已发数量时才更新
        },
      });

    if (updateCampaignRes.stats.updated === 0) {
      throw new Error('红包已被抢光或并发冲突，请重试'); // 通常是并发导致库存不足
    }
    const redeemCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 6. 创建用户红包记录
    const userRedPacket = {
      campaignId: campaignId,
      user: phoneNumber, // 关联用户
      prizeTypeId: selectedPrizeType.typeId,
      prizeName: selectedPrizeType.name,
      prizeDescription: selectedPrizeType.description,
      prizeValueType: selectedPrizeType.prizeType,
      prizeValueAmount: selectedPrizeType.valueAmount,
      prizeValueUnit: selectedPrizeType.valueUnit,
      redeemCode: redeemCode,
      status: 'unclaimed', // 初始状态为未领取
      receivedAt: db.serverDate(), // 领取时间
      expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 示例：30天后过期
    };

    await transaction.collection('user_red_packet').add({ data: userRedPacket });

    // 7. 提交事务
    await transaction.commit();

    return {
      success: true,
      message: '恭喜您，抢到红包！',
      redPacket: {
        // 返回抢到的红包信息给前端
        name: selectedPrizeType.name,
        type: selectedPrizeType.prizeType,
        description: selectedPrizeType.description,
        value: `${selectedPrizeType.valueAmount}`,
        redeemCode: redeemCode,
      },
    };
  } catch (e) {
    // 8. 任何错误发生，回滚事务
    await transaction.rollback();
    console.error('抢红包事务回滚，错误信息:', e.message);
    return {
      success: false,
      message: e.message || '抢红包失败，请稍后再试',
    };
  }
};
