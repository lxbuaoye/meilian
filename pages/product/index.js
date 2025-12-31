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
    this.getTabBar().init();
  },

  // 处理功能卡片点击
  handleFeatureTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.featureList[index];
    if (item.url) {
      wx.navigateTo({
        url: item.url,
      });
    }
  },
});