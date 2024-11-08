// pages/product-detail/index.js
const db = wx.cloud.database();
const _ = db.command;
const { CLOUD_STROAGE_PATH } = getApp().globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    instruction: {
      data: [],
    },
    currency: '¥',
    unit: '',
    containMultipleImages: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init(options.productId);
  },

  async init(productId) {
    console.log(productId);
    const { data } = await db
      .collection('product')
      .where({
        _id: _.eq(productId),
      })
      .limit(1)
      .get();
    this.setData({
      ...data[0],
    });
    if (data[0].images && data[0].images.length > 0) {
      this.setData({
        imageList: data[0].images.map((item) => {
          return `${CLOUD_STROAGE_PATH}/product/${productId}/${item}`;
        }),
        containMultipleImages: data[0].images.length > 1,
      });
    } else {
      this.setData({
        imageList: [`${CLOUD_STROAGE_PATH}/product/${productId}/cover.jpg`],
        containMultipleImages: false,
      });
    }
    console.log(this.data);
  },
  previewImage(e) {
    wx.previewImage({
      current: this.data.imageList[e.currentTarget.dataset.index],
      urls: this.data.imageList,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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
  onShareAppMessage() {
    return {
      title: `数码彩产品 - ${this.data.title}`,
    };
  },
  onShareTimeline() {
    return {
      title: `数码彩产品 - ${this.data.title}`,
    };
  },
});
