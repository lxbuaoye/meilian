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

  if (event.type === 'CONSUME') {
    await db
      .collection('user')
      .doc(result.data[0]._id)
      .update({
        data: {
          // 表示指示数据库将字段自减去 10
          credits: Math.max(result.data[0].credits - event.credits, 0),
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
