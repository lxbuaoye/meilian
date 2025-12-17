// components/number-banner/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    options: {
      during: 1, // (number) 动画时间
      height: 40, // (number) 滚动行高 px
      width: '100%', // (string) 组件整体宽度
      ease: 'cubic-bezier(0, 1, 0, 1)', // (string) 动画过渡效果
      color: '#FF5837', // (string) 字体颜色
      columnStyle: '', // (string) 字体单元 覆盖样式
    },
    list: [
      {
        number: '1000+',
        text: '高端涂装效果体验店',
      },
      {
        number: '10万+',
        text: '涂装大师',
      },
      {
        number: '500+',
        text: '涂装效果材质',
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {},
});
