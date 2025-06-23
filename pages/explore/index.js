// pages/explore/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;
const accountInfo = wx.getAccountInfoSync();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        name: 'DIGITAL AI',
        description: '运用数码彩AI的先进技术，您可以轻松地将草图、施工图或现有建筑转化为多种您喜爱的风格效果图。',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/explore/333.jpg`,
        // disabled: accountInfo.miniProgram.envVersion === 'release',
        dest: '/pages/ai/index',
      },
      // {
      //   name: '数码彩·印象',
      //   description: '20周年限时活动',
      //   imageSrc: `${CLOUD_STROAGE_PATH}/resources/explore/666.png`,
      //   dest: '/pages/portrait-ai/index',
      // },
      {
        name: '石漆配色',
        description: '石漆系列电子色卡，配用多个建筑模型，方便随时查看和搭配',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/explore/444.png`,
        dest: 'wx0a81e9aa1745be90',
        openAnotherMiniProgram: true,
      },
      {
        name: '色彩检测',
        description: '通过分析，你可以获取涂料里面的配色构成, 更可以精准查看每一个像素',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/explore/111.jpg`,
        dest: '/ColorDetector/pages/index',
      },
      {
        name: 'AR (全息透视)',
        description:
          '产品的详细介绍叠加在真实世界中，让你仿佛亲手触摸、告别枯燥的文字描述，体验更生动的产品信息获取方式。',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/explore/222.jpg`,
        dest: '/pages/ar/index',
      },
      {
        name: '五行织色',
        description: '根据你的五行, 判断出最适合你的颜色',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/explore/555.png`,
        dest: '/pages/wuxing/index',
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
    if (e.currentTarget.dataset.openAnotherMiniProgram) {
      this.navigateToShiqiMiniProgram(e.currentTarget.dataset.dest);
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
