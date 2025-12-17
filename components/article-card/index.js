// components/article-card/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;
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
      type: Date,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  lifetimes: {
    attached() {
      this.setData({
        imageUrl: `${CLOUD_STROAGE_PATH}/news/${this.data.newsId}/cover.jpg`,
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
