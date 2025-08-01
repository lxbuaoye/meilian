// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  console.log(event);
  try {
    const result = await cloud.openapi.wxacode.get({
      // path: `pages/portrait-ai/index`,
      path: `pages/admin-red-packet/index`,
      envVersion: 'trial',
      autoColor: false,
      width: 1280,
      lineColor: {
        r: '248',
        g: '195',
        b: '1',
      },
      isHyaline: true,
    });
    const result2 = await cloud.uploadFile({
      cloudPath: `resources/temp/qrcode.png`, // 自定义云存储路径和文件名
      fileContent: result.buffer, // 直接上传Buffer数据
    });
    return {
      success: true,
      fileId: result2.fileID, // 返回文件ID给小程序
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};
