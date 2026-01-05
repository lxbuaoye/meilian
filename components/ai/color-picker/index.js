// components/ai/color-picker/index.js
import { colorData } from './data';

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    colorData,
    selection: -1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTileClick(e) {
      // Clear out selection
      if (e.currentTarget.dataset.index === this.data.selection) {
        this.setData({ selection: -1 });
      } else {
        this.setData({ selection: e.currentTarget.dataset.index });
      }
    },
    onSelect() {
      console.log('Confirm color');
      this.triggerEvent('selectedcolor', this.data.colorData[this.data.selection]);
    },
  },
});
