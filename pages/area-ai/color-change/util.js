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

    // 如果已经是临时文件路径或网络路径，直接返回
    if (base64Data.startsWith('http') || base64Data.startsWith('wxfile') || base64Data.startsWith('cloud:')) {
      resolve(base64Data);
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
        try {
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
          await new Promise((resolve2, reject2) => {
            image.onload = resolve2;
            image.onerror = reject2;
            image.src = imageUrl;
          });

          // 先获取水印图片的临时路径
          let watermarkPath = watermarkSrc;
          try {
            // 尝试获取云图片信息，这将下载图片到本地临时路径
            const res = await wx.getImageInfo({ src: watermarkSrc });
            watermarkPath = res.path;
          } catch (e) {
            console.error('Get watermark info failed, trying original src', e);
          }

          const watermark = offscreenCanvas.createImage();
          // 等待水印载
          await new Promise((resolve2, reject2) => {
            watermark.onload = resolve2;
            watermark.onerror = (err) => {
              console.error('Watermark image load error', err);
              reject2(err);
            };
            watermark.src = watermarkPath;
          });

          // 获取水印图片信息用于计算宽高比
          const watermarkInfo = await wx.getImageInfo({
            src: watermarkPath,
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

          // 绘制文字
          ctx.font = 'bold 36px serif'; // 加粗字体
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'; // 不透明白色
          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'; // 黑色阴影
          ctx.shadowBlur = 6; // 阴影模糊度
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';

          // 放在右下角
          ctx.fillText('图片由美联美墅AI生成', originalImage.width - 20, originalImage.height - 20);

          // 3. 导出结果 - 使用 canvasToTempFilePath 避免转换 base64 造成的卡顿
          // 增加一个短暂延时，确保 Canvas 绘制指令（特别是文字和阴影）已被完全执行和渲染
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
                // 如果导出失败，尝试回退到 toDataURL (虽然慢但兼容性好)
                try {
                  const dataUrl = offscreenCanvas.toDataURL();
                  resolve(dataUrl);
                } catch (e) {
                  reject(err);
                }
              }
            });
          }, 200); // 200ms delay for safety

        } catch (error) {
          console.error('Add watermark failed', error);
          reject(error);
        }
      },
      fail: (err) => {
        console.error('Get image info failed', err);
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

