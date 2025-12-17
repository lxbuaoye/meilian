// pages/contactus/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;

const QR_CODE = `${CLOUD_STROAGE_PATH}/resources/contact-us/qr_code.jpg`;
const address = {
  latitude: '22.773652',
  longitude: '113.19467',
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    QR_CODE,
    ...address,
    markers: [
      {
        latitude: '22.773652',
        longitude: '113.19467',
      },
    ],
  },

  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: '4008383377',
    });
  },

  openLoation() {
    wx.openLocation({
      //​使用微信内置地图查看位置。
      latitude: 22.773652,
      longitude: 113.19467,
      name: '数码彩涂料有限公司',
      address: '广东省佛山市顺德区杏坛镇科技区九路13号',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

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
