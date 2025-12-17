// app-components/header/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    enableGoBack: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    banner: `${CLOUD_STROAGE_PATH}/resources/app/top_banner_bg.png`,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goBack() {
      wx.navigateBack({ delta: 1 });
    },
  },
});
