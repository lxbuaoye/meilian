// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();
const _ = db.command; // 用于原子操作

// 云函数入口函数
exports.main = async (event, context) => {
  const { campaignId, phoneNumber } = event; // 从前端接收活动ID和用户ID

  if (!phoneNumber) {
    // 或者使用 wxContext.OPENID 如果你只需要微信用户ID
    return { success: false, message: '用户信息缺失' };
  }

  try {
    //  1. 检查用户是否已领取过该红包活动
    const { data } = await db
      .collection('user_red_packet')
      .where({
        user: phoneNumber,
        campaignId: campaignId,
      })
      .limit(1)
      .get();

    if (data.length === 0) {
      // 如果 total 等于 0，代表没有该红包信息
      throw new Error('读取红包信息错误, 请稍后再试');
    }

    const selectedPrizeType = data[0];

    // Update 红包
    const updateCampaignRes = await db
      .collection('user_red_packet')
      .doc(selectedPrizeType._id)
      .update({
        data: {
          inflated: true,
        },
      });

    if (updateCampaignRes.stats.updated === 0) {
      throw new Error('膨胀失败，请重试');
    }

    return {
      success: true,
      message: '恭喜您, 膨胀成功',
    };
  } catch (e) {
    return {
      success: false,
      message: e.message || '红包膨胀失败，请稍后再试',
    };
  }
};
