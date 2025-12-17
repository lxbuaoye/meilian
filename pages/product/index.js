Page({
  data: {
    featureList: [
      {
        title: '电子色卡',
        subtitle: '预设文案预设文案预设文案',
        icon: '/image/2.0电子色卡/色卡.png',
      },
      {
        title: 'AI换色',
        subtitle: '预设文案预设文案预设文案',
        icon: '/image/2.0电子色卡/换色.png',
      },
      {
        title: '漆量计算',
        subtitle: '预设文案预设文案预设文案',
        icon: '/image/2.0电子色卡/计算.png',
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
});
