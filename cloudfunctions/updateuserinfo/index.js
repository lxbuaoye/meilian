// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const result = await db
    .collection('user')
    .where({
      phoneNumber: _.eq(event.phoneNumber),
    })
    .limit(1)
    .get();

  if (!result.data || result.data.length === 0) {
    return {
      errCode: 1,
      errMessage: 'User is not valid',
    };
  }

  const userInfo = result.data[0];

  if (event.type === 'CONSUME') {
    await db
      .collection('user')
      .doc(userInfo._id)
      .update({
        data: {
          // 表示指示数据库将字段自减去 10
          credits: Math.max(userInfo.credits - event.credits, 0),
        },
      });

    await db.collection('transaction').add({
      data: {
        user: userInfo.phoneNumber,
        openid: wxContext.OPENID,
        time: db.serverDate(),
        balanceAfter: Math.max(userInfo.credits - event.credits, 0),
        type: 'CONSUME',
        credits: event.credits,
      },
    });
  }
  if (event.type === 'REDEEM') {
    couponResult = await db
      .collection('coupon')
      .where({
        code: _.eq(event.couponCode.toUpperCase()),
        claimed: _.eq(false),
      })
      .limit(1)
      .get();
    // Not a valid coupon.
    if (!couponResult.data || couponResult.data.length === 0) {
      return {
        errCode: 1,
        errMessage: 'Coupon is not valid',
      };
    }

    await db
      .collection('coupon')
      .doc(couponResult.data[0]._id)
      .update({
        data: {
          claimed: true,
          claimUser: event.phoneNumber,
          claimTime: db.serverDate(),
        },
      });

    await db
      .collection('user')
      .doc(result.data[0]._id)
      .update({
        data: {
          credits: result.data[0].credits + couponResult.data[0].credits,
        },
      });

    await db.collection('transaction').add({
      data: {
        user: userInfo.phoneNumber,
        openid: wxContext.OPENID,
        time: db.serverDate(),
        balanceAfter: result.data[0].credits + couponResult.data[0].credits,
        type: 'REDEEM',
        credits: couponResult.data[0].credits,
      },
    });
  }
  if (event.type === 'DEPOSIT') {
    await db
      .collection('user')
      .doc(userInfo._id)
      .update({
        data: {
          credits: userInfo.credits + event.credits,
        },
      });

    await db.collection('transaction').add({
      data: {
        user: userInfo.phoneNumber,
        openid: wxContext.OPENID,
        time: db.serverDate(),
        planId: event.planId,
        balanceAfter: result.data[0].credits + event.credits,
        type: 'DEPOSIT',
        credits: event.credits,
      },
    });
  }

  if (event.type === 'TRANSFER') {
    const senderInfo = userInfo;
    const creditsToTransfer = parseInt(event.credits);
    // 查找接收方用户
    const receiverInfoResult = await db
      .collection('user')
      .where({
        phoneNumber: event.receiverPhoneNumber,
      })
      .get();

    // 接收方用户不存在则抛出错误
    if (receiverInfoResult.data.length === 0) {
      return {
        errCode: 2,
        errMsg: '接收方用户尚未注册或不存在',
      };
    }
    const receiverInfo = receiverInfoResult.data[0];

    // 3. 开始数据库事务
    try {
      const transactionResult = await db.runTransaction(async (transaction) => {
        // 3.1 检查发送方积分是否足够
        if (senderInfo.credits < creditsToTransfer) {
          // 如果积分不足，事务回滚
          return {
            errCode: 3,
            errMsg: '积分不足，无法转赠',
          };
        }

        // 3.2 减少发送方积分
        await transaction
          .collection('user')
          .doc(senderInfo._id)
          .update({
            data: {
              credits: senderInfo.credits - creditsToTransfer,
            },
          });

        // 3.3 增加接收方积分
        await transaction
          .collection('user')
          .doc(receiverInfo._id)
          .update({
            data: {
              credits: receiverInfo.credits + creditsToTransfer,
            },
          });

        // 3.4 记录发送方交易
        await transaction.collection('transaction').add({
          data: {
            user: senderInfo.phoneNumber,
            openid: wxContext.OPENID,
            time: db.serverDate(),
            balanceAfter: senderInfo.credits - creditsToTransfer,
            type: 'TRANSFER_OUT', // 转出
            credits: creditsToTransfer,
            peerId: receiverInfo._id,
          },
        });
        // 3.5 记录接收方交易
        await transaction.collection('transaction').add({
          data: {
            user: receiverInfo.phoneNumber,
            time: db.serverDate(),
            openid: receiverInfo.openid,
            balanceAfter: receiverInfo.credits + creditsToTransfer,
            type: 'TRANSFER_IN', // 转入
            credits: creditsToTransfer,
            peerId: senderInfo._id,
          },
        });

        // 如果所有操作都成功，提交事务
        return {
          errCode: 0,
          errMsg: '积分转赠成功!',
        };
      });
      // Only return if error happened. Otherwise, we should let the function to return new user info.
      if (transactionResult.errCode !== 0) {
        return transactionResult;
      }
    } catch (e) {
      console.error('事务提交失败', e);
      return {
        success: false,
        errCode: 3,
        errMsg: '积分转赠失败，请重试',
        error: e,
      };
    }
  }

  if (event.type === 'REFERRAL_AWARD') {
    await db
      .collection('user')
      .doc(userInfo._id)
      .update({
        data: {
          credits: userInfo.credits + event.credits,
        },
      });

    await db.collection('transaction').add({
      data: {
        user: userInfo.phoneNumber,
        openid: userInfo.openid,
        time: db.serverDate(),
        balanceAfter: userInfo.credits + event.credits,
        type: 'REFERRAL_AWARD',
        credits: event.credits,
      },
    });

    await db.collection('referral').add({
      data: {
        referrer: userInfo.phoneNumber,
        credits: event.credits,
        referee: event.referee,
        time: db.serverDate(),
      },
    });
  }

  // Get updated Data.
  const updatedUserResult = await db
    .collection('user')
    .where({
      phoneNumber: _.eq(event.phoneNumber),
    })
    .limit(1)
    .get();

  return {
    errCode: 0,
    userInfo: updatedUserResult.data[0],
  };
};
