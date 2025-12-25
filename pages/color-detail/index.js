// pages/color-detail/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    colorImage: `${CLOUD_STROAGE_PATH}/image/color-card/MK8401_jia_shi_red@2x.png`,
    colorName: 'MK8401加仕红',
    cases: [
      {
        id: 'case1',
        name: '河源碧桂园学校',
        image: `${CLOUD_STROAGE_PATH}/image/common/pic@2x.png`,
      },
      {
        id: 'case2',
        name: '凤岗碧桂园蔷薇花园',
        image: `${CLOUD_STROAGE_PATH}/image/common/pic@2x(1).png`,
      },
      {
        id: 'case3',
        name: '示例项目三',
        image: `${CLOUD_STROAGE_PATH}/image/common/pic@2x(2).png`,
      },
    ],
    statusBarHeight: 0,
    navBarHeight: 0,
    navBackIcon: `${CLOUD_STROAGE_PATH}/image/common/back.png`,
    downloadIcon: `${CLOUD_STROAGE_PATH}/image/common/download.png`,
    shareIcon: `${CLOUD_STROAGE_PATH}/image/common/share.png`,
    homeyuanIcon: `${CLOUD_STROAGE_PATH}/resources/homeyuan.png`,
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
  },

  handleBack() {
    wx.navigateBack({
      delta: 1,
    });
  },

  handleDownload() {
    // 这里只做占位交互，真实逻辑可接入下载接口
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


