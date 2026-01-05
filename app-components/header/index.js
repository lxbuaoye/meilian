// app-components/header/index.js
const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;

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
    banner: `${CLOUD_IMAGE_BASE}/resources/app/top_banner_bg.png`,
    logo: `${CLOUD_IMAGE_BASE}/resources/logo.png`,
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
