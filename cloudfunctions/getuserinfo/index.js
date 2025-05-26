// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();
const _ = db.command;

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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
    const name = `用户${generateRandomString(6)}`;
    await db.collection('user').add({
      data: {
        name: name,
        openid: wxContext.OPENID,
        phoneNumber: event.phoneNumber,
        credits: 50,
      },
    });
    return {
      name: name,
      openid: wxContext.OPENID,
      phoneNumber: event.phoneNumber,
      credits: 50,
    };
  }
  return result.data[0];
};
