// pages/showcase/index.js

const db = wx.cloud.database();
const _ = db.command;
const { CLOUD_STROAGE_PATH } = getApp().globalData;
const MAX_LIMIT = 20;
const category = ['外墙漆', '内墙漆', '艺术漆', '辅助材料'];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageLoading: false,
    category,
    categoryList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const menuButton = wx.getMenuButtonBoundingClientRect();
    this.setData({
      menuBarTop: menuButton.top,
      menuBarHeight: menuButton.height,
      stickyProps: { offsetTop: menuButton.top + menuButton.height },
    });
    this.init();
  },

  async init() {
    this.setData({ pageLoading: true });
    // fetch all product
    const { data } = await this.fetchAllProduct();
    console.log(data);
    // TODO, should sort by category
    this.setData({
      categoryList: this.sortProductByCategory(data),
    });
    this.setData({ pageLoading: false });
  },

  sortProductByCategory(productList) {
    console.log(productList[0]);
    const result = [];
    for (let i = 0; i < productList.length; i++) {
      const index = category.indexOf(productList[i].category);
      if (index === -1) continue;
      if (result[index]) {
        result[index].push(productList[i]);
      } else {
        result[index] = [productList[i]];
      }
    }
    return result;
  },

  async fetchAllProduct() {
    const countResult = await db.collection('product').count();
    const { total } = countResult;
    if (total === 0) return;
    // 计算需分几次取
    const batchTimes = Math.ceil(total / MAX_LIMIT);
    // 承载所有读操作的 promise 的数组
    const tasks = [];
    for (let i = 0; i < batchTimes; i++) {
      const promise = db
        .collection('product')
        .orderBy('index', 'asc')
        .field({
          _id: true,
          title: true,
          price: true,
          tags: true,
          unit: true,
          category: true,
        })
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
  onShareAppMessage() {
    return {
      title: `数码彩产品列表`,
    };
  },
  onShareTimeline() {
    return {
      title: `数码彩产品列表`,
    };
  },
});
