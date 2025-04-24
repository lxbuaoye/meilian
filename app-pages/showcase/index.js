// pages/showcase/index.js
const db = wx.cloud.database();
const _ = db.command;
const { CLOUD_STROAGE_PATH } = getApp().globalData;
const MAX_LIMIT = 20;
const showcaseMap = {};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categoryList: ['个性定制', '工程项目'],
    pageLoading: false,
    showcaseList: [],
    showcaseMap: null,
    categoryIndex: 0,
    listLoadingStatus: [0, 0],
    banner: `${CLOUD_STROAGE_PATH}/resources/app/top_banner_bg.png`,
  },
  pagination: [
    {
      index: 0,
      size: 6,
    },
    {
      index: 0,
      size: 6,
    },
  ],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // #if MP
    console.log('只在微信小程序执行');
    // #elif IOS
    console.log('只在 iOS 执行');
    // #elif ANDROID
    console.log('只在 Android 执行');
    // #endif
    const menuButton = wx.getMenuButtonBoundingClientRect();
    this.setData({
      menuBarTop: menuButton.top,
      menuBarHeight: menuButton.height,
    });
    this.init();
  },

  async init() {
    wx.stopPullDownRefresh();
    this.setData({ pageLoading: true });
    for (const category of this.data.categoryList) {
      showcaseMap[category] = [];
    }

    this.loadShowcase(false);
  },

  async loadShowcase() {
    this.setData({
      [`listLoadingStatus[${this.data.categoryIndex}]`]: 1,
    });
    const { data } = await this.fetchAllShowcase(
      this.pagination[this.data.categoryIndex].index,
      this.pagination[this.data.categoryIndex].size,
      this.data.categoryIndex,
    );
    this.pagination[this.data.categoryIndex].index++;
    this.seperateShowcaseByCategory(data);
    console.log(data);
    // TODO, add loading indicate bar
    // Handle error, set loading status to 3
    this.setData({ pageLoading: false, showcaseList: data, [`listLoadingStatus[${this.data.categoryIndex}]`]: 0 });
  },

  async fetchAllShowcase(index = 0, size = 4, categoryIndex = 0) {
    const res = await db
      .collection('showcase')
      .where({ category: _.eq(this.data.categoryList[categoryIndex]) })
      .field({
        _id: true,
        title: true,
        tags: true,
        category: true,
      })
      .orderBy('index', 'asc')
      .skip(index * size)
      .limit(size)
      .get();
    // 等待所有
    return res;
  },

  seperateShowcaseByCategory(showcaseList) {
    for (const showcase of showcaseList) {
      if (showcase.category in showcaseMap) {
        showcaseMap[showcase.category].push(showcase);
      }
    }
    this.setData({ showcaseMap: showcaseMap });
  },

  onTabsChange(e) {
    this.setData({ categoryIndex: e.detail.value });
    this.loadShowcase(false);
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
  onReachBottom() {
    if (this.data.listLoadingStatus[this.data.categoryIndex] === 0) {
      this.loadShowcase();
    }
  },

  /**
   * 用户点击右上角分享
   */ onShareAppMessage() {
    return {
      title: `数码彩案例列表`,
    };
  },
  onShareTimeline() {
    return {
      title: `数码彩案例列表`,
    };
  },
});
