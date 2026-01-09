// pages/showcase-list/index.js
const db = wx.cloud.database();
const _ = db.command;
const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;

Page({
  data: {
    categoryList: [],
    pageLoading: false,
    showcaseList: [],
    showcaseMap: {},
    categoryIndex: 0,
    listLoadingStatus: [],
    showcaseFallbackImages: [
      `${CLOUD_IMAGE_BASE}/image/common/pic@2x.png`,
      `${CLOUD_IMAGE_BASE}/image/common/pic@2x(1).png`,
      `${CLOUD_IMAGE_BASE}/image/common/pic@2x(2).png`,
    ],
    showcaseImageErrorMap: {},
    backIcon: `${CLOUD_IMAGE_BASE}/image/common/back@2x.png`,
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
    // Load showcase-new where lx === '仿石漆' and group by allx
    try {
      const res = await db.collection('showcase-new').where({ lx: '仿石漆' }).get();
      const docs = res && res.data ? res.data : [];
      const showcaseMap = {};
      const categorySet = new Set();
      docs.forEach((d) => {
        const key = d.allx || '默认';
        categorySet.add(key);
        if (!showcaseMap[key]) showcaseMap[key] = [];
        // prepare cover image url from tpdz if necessary; keep tpdz raw for now
        showcaseMap[key].push(d);
      });
      // normalize keys and merge duplicates (e.g., "个性案例" -> "个性定制")
      const normalize = (k) => (k === '个性案例' ? '个性定制' : k);
      const normalizedMap = {};
      Object.keys(showcaseMap).forEach((k) => {
        const nk = normalize(k);
        if (!normalizedMap[nk]) normalizedMap[nk] = [];
        normalizedMap[nk] = normalizedMap[nk].concat(showcaseMap[k]);
      });
      const categories = Object.keys(normalizedMap);
      this._showcaseMap = normalizedMap;
      this.setData({
        categoryList: categories,
        showcaseMap: normalizedMap,
        pageLoading: false,
        listLoadingStatus: categories.map(() => 0),
      });
    } catch (err) {
      console.error('init showcase-list failed', err);
      this.setData({ pageLoading: false });
    }
  },

  async loadShowcase() {
    // With new init grouping, nothing to do here. Data already loaded.
    this.setData({ pageLoading: false });
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


