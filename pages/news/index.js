// pages/news/index.js
const db = wx.cloud.database();
const _ = db.command;
const { CLOUD_STROAGE_PATH } = getApp().globalData;
const MAX_LIMIT = 20;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageLoading: false,
    newsList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init();
  },

  async init() {
    this.setData({ pageLoading: true });
    const { data } = await this.fetchAllNews();
    console.log(data);
    this.setData({ pageLoading: false, newsList: data });
  },

  async fetchAllNews() {
    const countResult = await db.collection('news').count();
    const { total } = countResult;
    if (total === 0) return;
    // 计算需分几次取
    const batchTimes = Math.ceil(total / MAX_LIMIT);
    // 承载所有读操作的 promise 的数组
    const tasks = [];
    for (let i = 0; i < batchTimes; i++) {
      const promise = db
        .collection('news')
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .get();
      tasks.push(promise);
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      };
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
  onShareAppMessage() {},
});
