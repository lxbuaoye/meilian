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
    selectedProductMap: { 1: true },
    crafts: [
      { id: 1, name: '工艺一' },
      { id: 2, name: '工艺二' },
      { id: 3, name: '工艺三' },
      { id: 4, name: '工艺四' }
    ],
    selectedCraftMap: { 0: true },
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
    const index = Number(e.currentTarget.dataset.index);
    this.setData({
      [`selectedProductMap.${index}`]: !this.data.selectedProductMap?.[index],
    });
  },

  onSelectCraft(e) {
    const index = Number(e.currentTarget.dataset.index);
    this.setData({
      [`selectedCraftMap.${index}`]: !this.data.selectedCraftMap?.[index],
    });
  },

  onGenerateTap() {
    wx.showToast({
      title: 'AI生成中',
      icon: 'none'
    });
  }
});







