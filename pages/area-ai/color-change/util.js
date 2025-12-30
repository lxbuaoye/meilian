const watermarkSrc =
  'https://6469-digital-7gwdimnu0a14ab1b-1330344628.tcb.qcloud.la/resources/ai/watermark.png?sign=2c0c0a6558a57cd4643f3171beca5db3&t=1745914583';

export function getImageBase64(filePath) {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: '/pages/ai/12.jpg',
      encoding: 'base64', // 指定编码格式为 base64
      success: (res) => {
        // 返回包含 Base64 前缀的 Data URL 格式
        resolve(res.data);
      },
      fail: (err) => {
        console.error('读取图片文件失败:', err);
        reject(err);
      },
    });
  });
}

export async function saveBase64ToTempFile(base64Data) {
  return new Promise((resolve, reject) => {
    if (!base64Data || typeof base64Data !== 'string') {
      reject('无效的 Base64 数据');
      return;
    }
    const pureBase64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
    if (!pureBase64String || typeof pureBase64String !== 'string') {
      reject('无效的 Base64 数据');
      return;
    }
    const filePath = `${wx.env.USER_DATA_PATH}/temp_image_${Date.now()}.jpeg`;
    wx.getFileSystemManager().writeFile({
      filePath: filePath,
      data: pureBase64String,
      encoding: 'base64',
      success: (res) => {
        console.log(`user path : ${filePath}`);
        resolve(filePath);
      },
      fail: (err) => {
        console.error('保存 Base64 图片失败:', err);
        reject(err);
      },
    });
  });
}

export async function addWatermarkToImage(imageUrl) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: imageUrl,
      success: async (originalImage) => {
        // 创建离屏 2D canvas 实例
        const offscreenCanvas = wx.createOffscreenCanvas({
          type: '2d',
          width: originalImage.width,
          height: originalImage.height,
        });
        // 2. 获取 2D 渲染上下文
        const ctx = offscreenCanvas.getContext('2d');

        const image = offscreenCanvas.createImage();
        // 等待图片加载
        await new Promise((resolve2) => {
          image.onload = resolve2;
          image.src = imageUrl;
        });

        const watermark = offscreenCanvas.createImage();
        // 等待水印载
        await new Promise((resolve2) => {
          watermark.onload = resolve2;
          watermark.src = watermarkSrc;
        });

        const watermarkInfo = await wx.getImageInfo({
          src: watermarkSrc,
        });

        // 绘制原图
        ctx.drawImage(image, 0, 0, originalImage.width, originalImage.height);

        const watermarkAspectRatio = watermarkInfo.width / watermarkInfo.height;

        let watermarkDrawWidth = watermarkInfo.width * 0.7;
        let watermarkDrawHeight = watermarkInfo.height * 0.7;
        // 确保水印不超过原始图片的尺寸 (可以根据需求调整缩放比例)
        const maxWatermarkWidth = originalImage.width * 0.7; // 水印最大宽度为原始图片的 90%
        const maxWatermarkHeight = originalImage.height * 0.7; // 水印最大高度为原始图片的 90%

        if (watermarkDrawWidth > maxWatermarkWidth) {
          watermarkDrawWidth = maxWatermarkWidth;
          watermarkDrawHeight = watermarkDrawWidth / watermarkAspectRatio;
        }

        if (watermarkDrawHeight > maxWatermarkHeight) {
          watermarkDrawHeight = maxWatermarkHeight;
          watermarkDrawWidth = watermarkDrawHeight * watermarkAspectRatio;
        }

        // 重新计算水印位置，使其居中
        const x = (originalImage.width - watermarkDrawWidth) / 2;
        const y = (originalImage.height - watermarkDrawHeight) / 2;

        // 绘制水印
        ctx.globalAlpha = 0.3;
        ctx.drawImage(watermark, x, y, watermarkDrawWidth, watermarkDrawHeight);
        ctx.globalAlpha = 1;
        ctx.font = '42px serif';
        ctx.fillStyle = 'white';
        ctx.fillText('图片由数码彩AI生成', originalImage.width - 420, originalImage.height - 50);

        // 3. 导出结果
        resolve(offscreenCanvas.toDataURL());
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

export async function downloadFileAsync(url) {
  return new Promise((resolve, reject) => {
    wx.cloud
      .getTempFileURL({
        fileList: [
          {
            fileID: 'a7xzcb',
            maxAge: 60 * 60, // one hour],
          },
        ],
      })
      .then((res) => {
        // get temp file URL
        resolve(res.fileList);
      })
      .catch((error) => {
        // handle error
        reject(error);
      });
  });
}
