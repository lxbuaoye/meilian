Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    products: [
      { id: 1, name: '微岩石' },
      { id: 2, name: '嵌御石' },
      { id: 3, name: '嵌御石' },
      { id: 4, name: '嵌御石' },
      { id: 5, name: '嵌御石' }
    ],
    currentProductIndex: 1,
    crafts: [
      { id: 1, name: '工艺一' },
      { id: 2, name: '工艺二' },
      { id: 3, name: '工艺三' },
      { id: 4, name: '工艺四' }
    ],
    currentCraftIndex: 0
  },

  onLoad() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      const navBarHeight = 44;
      this.setData({
        statusBarHeight,
        navBarHeight
      });
    } catch (e) {
      // ignore
    }
  },

  onBackTap() {
    wx.navigateBack({ delta: 1 });
  },

  onChooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: () => {},
      fail: () => {}
    });
  },

  onSelectProduct(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      currentProductIndex: index
    });
  },

  onSelectCraft(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      currentCraftIndex: index
    });
  },

  onGenerateTap() {
    wx.showToast({
      title: 'AI生成中',
      icon: 'none'
    });
  }
});




