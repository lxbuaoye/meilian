const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;

Page({
  data: {
    featureList: [
      {
        title: 'AI换色',
        subtitle: '预设文案预设文案预设文案',
        icon: `${CLOUD_IMAGE_BASE}/image/product/color_change.png`,
        url: '/pages/area-ai/color-change/index',
      },
      {
        title: '漆量计算',
        subtitle: '预设文案预设文案预设文案',
        icon: `${CLOUD_IMAGE_BASE}/image/product/calculate.png`,
        url: '', // 暂未设置跳转
      },
      {
        title: 'AI一键智诊',
        subtitle: '识别出裂缝、霉变、渗水等常见问题，并根据修复方案提供初步的诊断和建议',
        icon: `${CLOUD_IMAGE_BASE}/image/product/diagnosis_ai.png`,
        url: '/pages/diagnosis-ai/index',
      },
      {
        title: '木器翻新',
        subtitle: 'AI快速模拟翻新效果，为您的木器家具"换装"',
        icon: `${CLOUD_IMAGE_BASE}/image/product/furniture_ai.png`,
        url: '/pages/furniture-ai/index',
      },
      {
        title: '色彩检测',
        subtitle: '通过分析，你可以获取涂料里面的配色构成, 更可以精准查看每一个像素',
        icon: `${CLOUD_IMAGE_BASE}/image/product/color_detect.png`,
        url: '/ColorDetector/pages/index',
      },
      {
        title: '五行织色',
        subtitle: '根据你的五行, 判断出最适合你的颜色',
        icon: `${CLOUD_IMAGE_BASE}/image/product/wuxing.png`,
        url: '/pages/wuxing/index',
      },
      {
        title: '石漆配色',
        subtitle: '石漆系列电子色卡，配用多个建筑模型，方便随时查看和搭配',
        icon: `${CLOUD_IMAGE_BASE}/image/product/shiqi.png`,
        url: '',
        openAnotherMiniProgram: true,
        appId: 'wx0a81e9aa1745be90',
      },
    ],
    menuBarTop: 0,
    menuBarHeight: 44,
    logoImage: `${CLOUD_IMAGE_BASE}/resources/logo1.png`,
  },

  onLoad(options) {
    const menuButton = wx.getMenuButtonBoundingClientRect();
    this.setData({
      menuBarTop: menuButton.top,
      menuBarHeight: menuButton.height,
    });
  },

  onShow() {
    if (this.getTabBar && typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar();
      if (tabBar && typeof tabBar.init === 'function') tabBar.init();
    }
    setTimeout(() => {
      try {
        if (this.getTabBar && typeof this.getTabBar === 'function') {
          const tabBar2 = this.getTabBar();
          if (tabBar2 && typeof tabBar2.init === 'function') tabBar2.init();
        }
      } catch (e) {}
    }, 120);
  },

  // 处理功能卡片点击
  handleFeatureTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.featureList[index];
    if (item.openAnotherMiniProgram) {
      this.navigateToShiqiMiniProgram(item.appId);
      return;
    }
    if (item.url) {
      wx.navigateTo({
        url: item.url,
      });
    }
  },

  navigateToShiqiMiniProgram(appId) {
    wx.navigateToMiniProgram({
      appId: appId,
      envVersion: 'release',
    });
  },
});