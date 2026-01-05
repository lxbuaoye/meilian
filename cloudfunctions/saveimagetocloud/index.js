// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  const { cloudPath, imageData } = event;

  // 将Base64字符串解码为Buffer（二进制数据）
  const buffer = Buffer.from(imageData, 'base64');

  try {
    const uploadResult = await cloud.uploadFile({
      cloudPath: cloudPath, // 自定义云存储路径和文件名
      fileContent: buffer, // 直接上传Buffer数据
    });
    console.log('上传到云存储成功', uploadResult);
    return {
      success: true,
      fileId: uploadResult.fileID, // 返回文件ID给小程序
    };
  } catch (e) {
    console.error('上传到云存储失败', e);
    return {
      success: false,
      error: e,
    };
  }
};
