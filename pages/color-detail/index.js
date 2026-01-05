// pages/color-detail/index.js
const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    colorImage: `${CLOUD_IMAGE_BASE}/image/color-card/MK8401_jia_shi_red@2x.png`,
    colorName: 'MK8401加仕红',
    cases: [
      {
        id: 'case1',
        name: '河源碧桂园学校',
        image: `${CLOUD_IMAGE_BASE}/image/common/pic@2x.png`,
      },
      {
        id: 'case2',
        name: '凤岗碧桂园蔷薇花园',
        image: `${CLOUD_IMAGE_BASE}/image/common/pic@2x(1).png`,
      },
      {
        id: 'case3',
        name: '示例项目三',
        image: `${CLOUD_IMAGE_BASE}/image/common/pic@2x(2).png`,
      },
    ],
    statusBarHeight: 0,
    navBarHeight: 0,
    navBackIcon: `${CLOUD_IMAGE_BASE}/image/common/back.png`,
    downloadIcon: `${CLOUD_IMAGE_BASE}/image/common/download.png`,
    shareIcon: `${CLOUD_IMAGE_BASE}/image/common/share.png`,
    homeyuanIcon: `${CLOUD_IMAGE_BASE}/resources/homeyuan.png`,
  },

  onLoad(options) {
    // 获取状态栏高度
    const systemInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight || 0;
    const windowWidth = systemInfo.windowWidth || 375;
    // 导航栏总高度 = 状态栏高度(px) + 导航内容高度(100rpx 转 px) + 额外间距
    const navContentHeightPx = (windowWidth * 100) / 750;
    const navBarHeight = statusBarHeight + navContentHeightPx + 20;
    this.setData({
      statusBarHeight: statusBarHeight,
      navBarHeight: navBarHeight,
    });

    // 预留参数处理逻辑，例如根据色卡 ID 加载不同数据
    if (options && options.name) {
      this.setData({
        colorName: decodeURIComponent(options.name),
      });
    }

    // 如果传入 img 参数，先使用；否则从云数据库按 name/code 查询图片以保证准确
    if (options && options.img) {
      // #region agent log
      try {
        fetch('http://127.0.0.1:7242/ingest/4dfd47dc-5184-408a-80e6-ead7f5d01f49',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'D1',location:'pages/color-detail/index.js:onLoad',message:'options.img present',data:{img:options.img,name:options.name,code:options.code},timestamp:Date.now()})}).catch(()=>{});
      } catch(e) {}
      // #endregion
      this.setData({
        colorImage: decodeURIComponent(options.img),
        colorHex: decodeURIComponent(options.color || '') || '',
      });
    } else if (options && (options.code || options.name)) {
      const queryKey = decodeURIComponent(options.code || options.name);
      // 如果传入 color（纯色色块）则直接使用，不从 DB 查图
      if (options.color) {
        this.setData({
          colorHex: decodeURIComponent(options.color),
        });
        return;
      }
      this.fetchImageFromDB(queryKey).catch((err) => {
        console.warn('从数据库获取图片失败，使用默认图片', err);
      });
    }
  },

  // 按产品名称或编码从云数据库中查询图片路径（tpdz 字段）
  async fetchImageFromDB(queryKey) {
    if (!wx.cloud || !wx.cloud.database) {
      console.warn('wx.cloud 未初始化，无法从云数据库获取图片');
      return;
    }
    try {
      const db = wx.cloud.database();
      const res = await db.collection('product_dzsk').where({
        cpmc: queryKey
      }).limit(1).get();
      const doc = (res && res.data && res.data[0]) || null;
      if (doc && doc.tpdz) {
        this.setData({
          colorImage: doc.tpdz
        });
      } else {
        // 如果没有按 cpmc 找到，再尝试按 name 字段或 category/subcategory 匹配
        const res2 = await db.collection('product_dzsk').where({
          cpmc: db.command.regex({
            regexp: queryKey,
            options: 'i'
          })
        }).limit(1).get();
        const doc2 = (res2 && res2.data && res2.data[0]) || null;
        if (doc2 && doc2.tpdz) {
          this.setData({ colorImage: doc2.tpdz });
        }
      }
    } catch (err) {
      console.error('fetchImageFromDB error', err);
    }
  },

  handleBack() {
    wx.navigateBack({
      delta: 1,
    });
  },

  handleDownload() {
    // If this is a pure color (no image), copy color hex code to clipboard
    if (this.data.colorHex) {
      wx.setClipboardData({
        data: this.data.colorHex,
        success: () => {
          wx.showToast({ title: '色号已复制', icon: 'success' });
        },
      });
      return;
    }
    // 否则保持原有下载提示（真实逻辑可以实现保存图片）
    wx.showToast({
      title: '已保存到相册',
      icon: 'success',
    });
  },

  handleShare() {
    wx.showShareMenu({
      withShareTicket: true,
    });
  },

  previewImage() {
    const currentImage = this.data.colorImage;
    if (!currentImage) return;
    wx.previewImage({
      current: currentImage,
      urls: [currentImage],
    });
  },

  handleCaseTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/showcase-detail/index?id=${id}`,
    });
  },

  onShareAppMessage() {
    return {
      title: `色卡详情 - ${this.data.colorName}`,
    };
  },
});


