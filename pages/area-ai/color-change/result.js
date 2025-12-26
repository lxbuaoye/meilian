const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;

Page({
  data: {
    statusBarHeight: 20,
    products: [
      { name: '微岩石' },
      { name: '蟻御石' },
      { name: '蟻御石' },
      { name: '蟻御石' },
      { name: '蟻行' }
    ],
    craft: '新中式, 外墙',
    resultImage: `${CLOUD_IMAGE_BASE}/image/area-ai/pic@2x.png`,
    navBackIcon: `${CLOUD_IMAGE_BASE}/image/area-ai/back@2x.png`,
    modalIcon: `${CLOUD_IMAGE_BASE}/image/area-ai/icon-40px@2x.png`,
  },

  onLoad(options) {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      this.setData({
        statusBarHeight
      });
    } catch (e) {
      console.error('获取系统信息失败', e);
    }

    // 如果有传递的产品数据，更新数据
    if (options.products) {
      try {
        const products = JSON.parse(decodeURIComponent(options.products));
        this.setData({ products });
      } catch (e) {
        console.error('解析产品数据失败', e);
      }
    }
    
    // 如果有传递的工艺数据，更新数据
    if (options.craft) {
      this.setData({ craft: decodeURIComponent(options.craft) });
    }
  },

  onBackTap() {
    wx.navigateBack({ delta: 1 });
  },

  onMoreTap() {
    wx.showActionSheet({
      itemList: ['分享', '复制链接'],
      success: (res) => {
        if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: '',
          });
        }
      },
    });
  },

  onShareTap() {
    wx.showShareMenu({
      withShareTicket: true,
    });
  },

  onDownloadTap() {
    wx.showToast({
      title: '下载中...',
      icon: 'loading',
      duration: 2000
    });
    
    // 这里可以添加实际的下载逻辑
    setTimeout(() => {
      wx.showToast({
        title: '下载成功',
        icon: 'success'
      });
    }, 2000);
  }
});

