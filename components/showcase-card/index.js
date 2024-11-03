// components/showcase-card/index.js
const fakeData = {
  id: '1',
  title: '建筑案例一',
  tags: ['内墙案例', '工厂翻新'],
  coverImageUrl: './index.jpg',
};

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    ...fakeData,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateToDetail() {
      wx.navigateTo({
        url: `/pages/showcase-detail/index?id=${this.data.id}`,
      });
    },
  },
});
