// components/product-card/index.js
const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productId: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    price: {
      type: Number,
      value: 0,
    },
    tags: {
      type: Array,
      value: [],
    },
    unit: {
      type: String,
      value: '件',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currency: '¥',
  },

  lifetimes: {
    attached() {
      this.setData({
        imageUrl: `${CLOUD_IMAGE_BASE}/product/${this.data.productId}/cover.jpg`,
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickHandle() {
      wx.navigateTo({
        url: `/pages/product-detail/index?productId=${this.data.productId}`,
      });
    },
  },
});
