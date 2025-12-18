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
    // 多选：默认都不选中
    selectedProductMap: {},
    crafts: [
      { id: 1, name: '工艺一' },
      { id: 2, name: '工艺二' },
      { id: 3, name: '工艺三' },
      { id: 4, name: '工艺四' }
    ],
    // 多选：默认都不选中
    selectedCraftMap: {},
    resultVisible: false,
    resultProducts: [
      { name: '微岩石' },
      { name: '峯御石' },
      { name: '峯御石' },
      { name: '峯御石' },
      { name: '峯御石' },
    ],
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

  onShow() {
    // 再次调用，确保胶囊和分享菜单被隐藏（有些端需在 onShow 调用）
    wx.hideHomeButton && wx.hideHomeButton();
    wx.hideShareMenu && wx.hideShareMenu();
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
    // 直接展示结果弹窗
    this.setData({
      resultVisible: true,
    });
  },

  onCloseResult() {
    this.setData({
      resultVisible: false,
    });
  }
});









