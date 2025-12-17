// components/showcase-card/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showcaseId: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    tags: {
      type: Array,
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
        coverImageUrl: `${CLOUD_STROAGE_PATH}/showcase/${this.data.showcaseId}/cover.jpg`,
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateToDetail() {
      wx.navigateTo({
        url: `/app-pages/showcase-detail/index?id=${this.data.showcaseId}`,
      });
    },
  },
});
