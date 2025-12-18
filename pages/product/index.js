Page({
  data: {
    featureList: [
      {
        title: '电子色卡',
        subtitle: '预设文案预设文案预设文案',
        icon: '/image/2.0电子色卡/色卡.png',
        url: '/pages/color-card/index',
      },
      {
        title: 'AI换色',
        subtitle: '预设文案预设文案预设文案',
        icon: '/image/2.0电子色卡/换色.png',
        url: '/pages/area-ai/color-change/index',
      },
      {
        title: '漆量计算',
        subtitle: '预设文案预设文案预设文案',
        icon: '/image/2.0电子色卡/计算.png',
        url: '', // 暂未设置跳转
      },
    ],
    menuBarTop: 0,
    menuBarHeight: 44,
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