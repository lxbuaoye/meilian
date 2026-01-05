// components/article-card/index.js
const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    newsId: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    subtitle: {
      type: String,
      value: '',
    },
    description: {
      type: String,
      value: 0,
    },
    date: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  lifetimes: {
    attached() {
      this.setData({
        imageUrl: `${CLOUD_IMAGE_BASE}/news/${this.data.newsId}/cover.jpg`,
      });
      console.log(this.data.imageUrl);
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    openArticleDetail() {
      // 已删除新闻详情页面
      wx.showToast({
        title: '功能暂未开放',
        icon: 'none',
      });
    },
  },
});
