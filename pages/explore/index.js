// pages/explore/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        name: '色彩检测',
        description: '通过分析，你可以获取涂料里面的配色构成, 更可以以及精准查看每一个像素',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/explore/111.jpg`,
        dest: '/ColorDetector/pages/index',
      },
      {
        name: 'AR(虚拟增强)',
        description:
          '产品的详细介绍叠加在真实世界中，让你仿佛亲手触摸、告别枯燥的文字描述，体验更生动的产品信息获取方式。',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/explore/222.jpg`,
        dest: '/pages/ar/index',
      },
      {
        name: 'DIGITAL AI',
        description: '运用数码彩AI的先进技术，您可以轻松地将草图、施工图或现有建筑转化为多种您喜爱的风格效果图。',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/explore/333.jpg`,
        disabled: true,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  onTap(e) {
    if (e.currentTarget.dataset.disabled) {
      return;
    }
    console.log(e);
    wx.navigateTo({
      url: e.currentTarget.dataset.dest,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getTabBar().init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
