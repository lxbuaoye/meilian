const watermarkSrc = 'cloud://cloud1-9gz59mfw7610d03f.636c-cloud1-9gz59mfw7610d03f-1392076473/image/ai/logo@2x.png';

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

        try {
          // 尝试获取云图片信息，这将返回本地临时路径用于绘制
          let watermarkPath = watermarkSrc;
          try {
            const res = await wx.getImageInfo({ src: watermarkSrc });
            watermarkPath = res.path;
          } catch (e) {
            console.error('Get watermark info failed, trying original src', e);
          }

        const watermark = offscreenCanvas.createImage();
          await new Promise((resolve2, reject2) => {
          watermark.onload = resolve2;
            watermark.onerror = (err) => {
              console.error('Watermark image load error', err);
              reject2(err);
            };
            watermark.src = watermarkPath;
        });

          const watermarkInfo = await wx.getImageInfo({ src: watermarkPath });

        // 绘制原图
        ctx.drawImage(image, 0, 0, originalImage.width, originalImage.height);

        const watermarkAspectRatio = watermarkInfo.width / watermarkInfo.height;

        let watermarkDrawWidth = watermarkInfo.width * 0.7;
        let watermarkDrawHeight = watermarkInfo.height * 0.7;
          const maxWatermarkWidth = originalImage.width * 0.7;
          const maxWatermarkHeight = originalImage.height * 0.7;

        if (watermarkDrawWidth > maxWatermarkWidth) {
          watermarkDrawWidth = maxWatermarkWidth;
          watermarkDrawHeight = watermarkDrawWidth / watermarkAspectRatio;
        }

        if (watermarkDrawHeight > maxWatermarkHeight) {
          watermarkDrawHeight = maxWatermarkHeight;
          watermarkDrawWidth = watermarkDrawHeight * watermarkAspectRatio;
        }

        const x = (originalImage.width - watermarkDrawWidth) / 2;
        const y = (originalImage.height - watermarkDrawHeight) / 2;

        ctx.globalAlpha = 0.3;
        ctx.drawImage(watermark, x, y, watermarkDrawWidth, watermarkDrawHeight);
        ctx.globalAlpha = 1;

          // 绘制右下角文字，样式与 area-ai 保持一致
          ctx.font = 'bold 36px serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
          ctx.shadowBlur = 6;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          ctx.fillText('图片由美联美墅AI生成', originalImage.width - 20, originalImage.height - 20);

          // 导出为临时文件以提高兼容性和性能
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvas: offscreenCanvas,
              fileType: 'jpg',
              quality: 0.85,
              destWidth: originalImage.width,
              destHeight: originalImage.height,
              success: (res) => {
                resolve(res.tempFilePath);
              },
              fail: (err) => {
                console.error('Canvas export failed', err);
                try {
                  const dataUrl = offscreenCanvas.toDataURL();
                  resolve(dataUrl);
                } catch (e) {
                  reject(err);
                }
              },
            });
          }, 200);
        } catch (error) {
          console.error('Add watermark failed', error);
          reject(error);
        }
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
