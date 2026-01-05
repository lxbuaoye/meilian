export async function fetchProducts() {
  return new Promise((resolve, reject) => {
    wx.cloud
      .callFunction({
        name: 'getallproducts',
        data: {},
      })
      .then(async (res) => {
        if (!res.result.success) {
          reject(new Error(res.result.error));
          return;
        }

        const products = res.result.data || [];

        // 收集所有可能的缩略图 fileIDs
        const fileIdToProductIndex = {};
        const fileList = [];
        products.forEach((p, idx) => {
          // 常见字段名尝试：compressed_color_card(s), thumbnailFileID, thumbnail, imageFileID, image, fileID
          const candidates = [
            p.compressed_color_card,
            p.compressed_color_cards,
            p.thumbnailFileID,
            p.thumbnail,
            p.imageFileID,
            p.image,
            p.fileID,
          ];
          for (const c of candidates) {
            if (typeof c === 'string' && c.startsWith('cloud://')) {
              // 记录并去重
              if (!fileIdToProductIndex[c]) {
                fileIdToProductIndex[c] = [];
                fileList.push({ fileID: c, maxAge: 60 * 60 });
              }
              fileIdToProductIndex[c].push(idx);
              break;
            }
          }
        });

        try {
          // 请求临时 URL
          let urlMap = {};
          if (fileList.length > 0) {
            const resp = await wx.cloud.getTempFileURL({ fileList });
            // resp.fileList: [{fileID, tempFileURL, maxAge}]
            (resp.fileList || []).forEach((f) => {
              urlMap[f.fileID] = f.tempFileURL || '';
            });
          }

        // 将 temp URL 注入到 products 中
          const enriched = products.map((p) => {
            // 确定展示用图片和色卡名称（cpmc）
            let imageSrc = '';
          // 优先处理数据库中的 tpdz 字段（与 color-card 页面的处理一致）
          try {
            const basePath = (getApp && getApp().globalData && getApp().globalData.CLOUD_STROAGE_PATH) || '';
            if (p.tpdz) {
              let compressed = p.tpdz;
              if (typeof compressed === 'string' && compressed.includes('/product/')) {
                compressed = compressed.replace('/product/', '/compressed_color_cards/');
              }
              // 若为绝对路径（以 / 开头）且未包含 http/cloud 协议，拼接 basePath
              if (typeof compressed === 'string' && compressed.startsWith('/') && !compressed.startsWith('http') && !compressed.startsWith('cloud://') && basePath) {
                compressed = `${basePath}${compressed}`;
              }
              if (compressed) {
                imageSrc = compressed;
              }
            }
          } catch (e) {
            // ignore
          }
            const candidates = [
            // include tpdz as candidate fallback
            p.tpdz,
              p.compressed_color_card,
              p.compressed_color_cards,
              p.thumbnailFileID,
              p.thumbnail,
              p.imageFileID,
              p.image,
              p.fileID,
            ];
            for (const c of candidates) {
              if (typeof c === 'string' && c.startsWith('cloud://') && urlMap[c]) {
                imageSrc = urlMap[c];
                break;
              }
            }
            // fallback to any http url fields
            if (!imageSrc) {
              imageSrc = p.thumbnail || p.image || '';
            }

            return {
              ...p,
              imageSrc,
              colorName: p.cpmc || p.name || '',
            };
          });

          resolve(enriched);
        } catch (e) {
          // 即使获取缩略图失败，也返回基础数据
          const fallback = products.map((p) => ({
            ...p,
            imageSrc: p.thumbnail || p.image || '',
            colorName: p.cpmc || p.name || '',
          }));
          resolve(fallback);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function fetchCompressedColorCards() {
  return new Promise((resolve, reject) => {
    wx.cloud
      .getTempFileURL({
        fileList: [
          {
            fileID: 'compressed_color_cards', // 需要根据实际的云存储路径调整
            maxAge: 60 * 60, // one hour
          },
        ],
      })
      .then((res) => {
        resolve(res.fileList[0].tempFileURL);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
