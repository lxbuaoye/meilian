// pages/showcase-list/index.js
const db = wx.cloud.database();
const _ = db.command;

Page({
  data: {
    categoryList: ['个性定制', '工程项目'],
    pageLoading: false,
    showcaseList: [],
    showcaseMap: null,
    categoryIndex: 0,
    listLoadingStatus: [0, 0],
  },

  pagination: [
    {
      index: 0,
      size: 5,
    },
    {
      index: 0,
      size: 5,
    },
  ],

  onLoad() {
    this.init();
  },

  async init() {
    wx.stopPullDownRefresh();
    this.setData({ pageLoading: true });
    const showcaseMap = {};
    for (const category of this.data.categoryList) {
      showcaseMap[category] = [];
    }
    this._showcaseMap = showcaseMap;
    this.loadShowcase();
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
    this.setData({
      pageLoading: false,
      showcaseList: data,
      [`listLoadingStatus[${this.data.categoryIndex}]`]: 0,
    });
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
    return res;
  },

  seperateShowcaseByCategory(showcaseList) {
    for (const showcase of showcaseList) {
      if (showcase.category in this._showcaseMap) {
        this._showcaseMap[showcase.category].push(showcase);
      }
    }
    this.setData({ showcaseMap: this._showcaseMap });
  },

  onTabsChange(e) {
    this.setData({ categoryIndex: e.detail.value });
    this.loadShowcase();
  },

  onReachBottom() {
    if (this.data.listLoadingStatus[this.data.categoryIndex] === 0) {
      this.loadShowcase();
    }
  },

  onBack() {
    wx.navigateBack({
      delta: 1,
    });
  },
});


