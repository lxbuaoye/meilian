// pages/news/detail/index.js
const db = wx.cloud.database();
const _ = db.command;
const { CLOUD_STROAGE_PATH } = getApp().globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dateString: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.init(options.newsId);
  },

  async init(newsId) {
    const { data } = await db
      .collection('news')
      .where({
        _id: _.eq(newsId),
      })
      .limit(1)
      .get();
    console.log(data);
    this.setData({ ...data[0], dateString: this.formatDate(data[0].uploadDate) });
    this.setData({
      description: this.data.description
        .replace(/&lt;/g, '<')
        .replace(/<img/g, '<img style="max-width:100%;height:auto;display:block; margin: 10px 0; border-radius: 8px;"'),
    });
  },

  formatDate(unixTime) {
    const date = new Date(unixTime);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
  onShareAppMessage() {},
});
