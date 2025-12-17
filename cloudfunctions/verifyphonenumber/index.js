// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
}); // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const result = await cloud.openapi.phonenumber.getPhoneNumber({
    code: event.code,
  });
  return { ...result.phoneInfo, openId: wxContext.OPENID };
};
