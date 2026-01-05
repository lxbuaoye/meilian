// app-components/subheader/index.js
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = getApp().globalData;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    bulletPointImage: `${CLOUD_IMAGE_BASE}/resources/bulletpoint.png`,
  },

  /**
   * 组件的方法列表
   */
  methods: {},
});
