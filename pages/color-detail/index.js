// pages/color-detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    colorImage: '/image/2.1.1 电子色卡·详情.png',
    colorName: 'MK8401加仕红',
    cases: [
      {
        id: 'case1',
        name: '河源碧桂园学校',
        image: '/image/2.1.2 电子色卡·详情·案例详情.png',
      },
      {
        id: 'case2',
        name: '凤岗碧桂园蔷薇花园',
        image: '/image/2.1.3 电子色卡·详情·案例详情·产品 1.png',
      },
      {
        id: 'case3',
        name: '示例项目三',
        image: '/image/2.1.2 电子色卡·详情·案例详情.png',
      },
    ],
    statusBarHeight: 0,
  },

  onLoad(options) {
    // 获取状态栏高度（与 showcase-detail 保持一致的实现方式）
    const systemInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 0,
    });

    // 预留参数处理逻辑，例如根据色卡 ID 加载不同数据
    if (options && options.name) {
      this.setData({
        colorName: options.name,
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
    console.log('tap case', id);
    // 可跳转到对应案例详情页
    // wx.navigateTo({ url: `/pages/showcase-detail/index?id=${id}` });
  },

  onShareAppMessage() {
    return {
      title: `色卡详情 - ${this.data.colorName}`,
    };
  },
});


