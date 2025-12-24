// pages/showcase-list/index.js
const db = wx.cloud.database();
const _ = db.command;
const { CLOUD_STROAGE_PATH } = getApp().globalData;

Page({
  data: {
    categoryList: ['个性定制', '工程项目'],
    pageLoading: false,
    showcaseList: [],
    showcaseMap: {},
    categoryIndex: 0,
    listLoadingStatus: [0, 0],
    showcaseFallbackImages: [
      '/image/v1.1_case_list_assets/pic@2x.png',
      '/image/v1.1_case_list_assets/pic@2x(1).png',
      '/image/v1.1_case_list_assets/pic@2x(2).png',
    ],
    showcaseImageErrorMap: {},
  },

  pagination: [
    {
      index: 0,
      size: 1000,
    },
    {
      index: 0,
      size: 1000,
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
    this._loadedCategory = {};
    this.loadShowcase();
  },

  async loadShowcase() {
    const category = this.data.categoryList[this.data.categoryIndex];
    if (this._loadedCategory && this._loadedCategory[category]) {
      this.setData({
        pageLoading: false,
        [`listLoadingStatus[${this.data.categoryIndex}]`]: 0,
      });
      return;
    }
    this.setData({
      [`listLoadingStatus[${this.data.categoryIndex}]`]: 1,
    });
    const { data } = await this.fetchAllShowcase(
      this.pagination[this.data.categoryIndex].index,
      this.pagination[this.data.categoryIndex].size,
      this.data.categoryIndex,
    );
    const showcaseList = (data || []).map((item) => {
      return {
        ...item,
        coverImageUrl: `${CLOUD_STROAGE_PATH}/showcase/${item._id}/cover.jpg`,
      };
    });
    this.pagination[this.data.categoryIndex].index++;
    this.seperateShowcaseByCategory(showcaseList);
    if (this._loadedCategory) {
      this._loadedCategory[category] = true;
    }
    this.setData({
      pageLoading: false,
      showcaseList,
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
    const category = this.data.categoryList[this.data.categoryIndex];
    if (category in this._showcaseMap) {
      this._showcaseMap[category] = [];
    }
    for (const showcase of showcaseList) {
      if (showcase.category in this._showcaseMap) {
        this._showcaseMap[showcase.category].push(showcase);
      }
    }
    this.setData({ showcaseMap: this._showcaseMap });
  },

  onShowcaseCoverError(e) {
    const id = e?.currentTarget?.dataset?.id;
    if (!id) return;
    this.setData({
      [`showcaseImageErrorMap.${id}`]: true,
    });
  },

  onTabsChange(e) {
    this.setData({ categoryIndex: e.detail.value });
    this.loadShowcase();
  },

  onReachBottom() {
    const category = this.data.categoryList[this.data.categoryIndex];
    if (this._loadedCategory && this._loadedCategory[category]) {
      return;
    }
    if (this.data.listLoadingStatus[this.data.categoryIndex] === 0) {
      this.loadShowcase();
    }
  },

  onBack() {
    wx.navigateBack({
      delta: 1,
    });
  },

  onShowcaseClick(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/showcase-detail/index?id=${id}`,
    });
  },
});


