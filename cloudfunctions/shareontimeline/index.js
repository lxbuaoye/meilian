// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();
const _ = db.command;

const SHARE_CREDITS = 50;

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

  const transaction = await db
    .collection('transaction')
    .where({
      user: _.eq(userInfo.phoneNumber),
      type: _.eq('SHARE_ON_TIMELINE'),
    })
    .limit(1)
    .get();

  if (transaction.data && transaction.data.length !== 0) {
    return {
      errCode: 21,
      errMessage: 'User already claimed SHARE_ON_TIMELINE credits',
    };
  }

  await db
    .collection('user')
    .doc(userInfo._id)
    .update({
      data: {
        credits: userInfo.credits + SHARE_CREDITS,
      },
    });

  await db.collection('transaction').add({
    data: {
      user: userInfo.phoneNumber,
      time: db.serverDate(),
      openid: wxContext.OPENID,
      balanceAfter: userInfo.credits + SHARE_CREDITS,
      type: 'SHARE_ON_TIMELINE',
      credits: SHARE_CREDITS,
    },
  });

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
