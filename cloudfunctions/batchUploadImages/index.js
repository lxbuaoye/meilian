// 云函数：批量上传图片到云存储
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { action, imagePath, cloudPath } = event

  try {
    if (action === 'upload') {
      // 上传单个图片
      const fileContent = fs.readFileSync(imagePath)
      const result = await cloud.uploadFile({
        cloudPath: cloudPath,
        fileContent: fileContent,
      })
      return {
        code: 0,
        message: '上传成功',
        data: result
      }
    } else if (action === 'batchUpload') {
      // 批量上传（这里可以扩展为批量上传逻辑）
      return {
        code: 1,
        message: '批量上传功能待实现，请使用控制台手动上传'
      }
    } else {
      return {
        code: -1,
        message: '未知操作'
      }
    }
  } catch (error) {
    console.error('上传失败:', error)
    return {
      code: -1,
      message: '上传失败',
      error: error.message
    }
  }
}
