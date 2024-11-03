// components/product-card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currency: {
      type: String,
      value: '¥',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    goods: {
      price: 9999,
      title: '铜墙铁壁系列外墙漆',
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {},
});
