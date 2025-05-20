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
  if (result.data && result.data.length > 0) {
    await db
      .collection('user')
      .doc(result.data[0]._id)
      .update({
        data: {
          openid: wxContext.OPENID,
        },
      });
  }
  return result.data;
};
