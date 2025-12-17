// pages/explore/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;
const accountInfo = wx.getAccountInfoSync();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverSrc: `${CLOUD_STROAGE_PATH}/resources/explore/explore_cover.png`,
    list: [
      {
        name: '数码彩·印象',
        description: '20周年限时活动',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/explore/666.png`,
        dest: '/app-pages/portrait-ai/index',
      },
      {
        name: '五行织色',
        description: '根据你的五行, 判断出最适合你的颜色',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/explore/555.png`,
        dest: '/app-pages/wuxing/index',
      },
      {
        name: 'DIGITAL AI',
        description: '运用数码彩AI的先进技术，您可以轻松地将草图、施工图或现有建筑转化为多种您喜爱的风格效果图。',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/explore/333.jpg`,
        // disabled: accountInfo.miniProgram.envVersion === 'release',
        disabled: true,
        dest: '/app-pages/ai/index',
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

  navigateToShiqiMiniProgram(dest) {
    wx.navigateToMiniProgram({
      appId: dest,
      envVersion: 'release',
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

  onShareTimeline() {
    return {
      title: `数码彩智慧算法空间`,
    };
  },

  handleClick() {
    wx.cloud
      .callFunction({
        // 云函数名称
        name: 'generateImage',
        // 传给云函数的参数
        data: {},
      })
      .then((res) => {
        console.log(res);
      });
  },
});
