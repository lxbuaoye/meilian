// components/ai/picker/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    header: {
      type: String,
      value: '',
    },
    list: {
      type: Object,
      value: '',
    },
    itemWidth: {
      type: Number,
      value: 104,
    },
    itemHeight: {
      type: Number,
      value: 104,
    },
    innerPadding: {
      type: Number,
      value: 0,
    },
    outterPadding: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: 0,
    prompt: '',
    selection: '无',
    colorPickerVisible: false,
  },

  attached() {
    this.updateSelectionWithIndex(0);
  }, // 此处atta
  /**
   * 组件的方法列表
   */
  methods: {
    updateSelectionWithIndex(index) {
      if (this.data.list[index] && this.data.list[index].moreColorOption) {
        this.setData({ colorPickerVisible: true });
        return;
      }
      this.setData({
        value: index,
        selection: this.data.list[index].name,
        prompt: this.data.list[index].prompt,
      });
      if (this.data.list[index].shouldDownload) {
        this.setData({
          shouldDownload: this.data.list[index].shouldDownload,
          inputImageSrc: this.data.list[index].inputImageSrc,
        });
      } else {
        this.setData({
          shouldDownload: false,
        });
      }
      if (this.data.list[index].color) {
        this.setData({
          color: this.data.list[index].color,
        });
      }
      if (this.data.list[index].approximateName) {
        this.setData({
          approximateName: this.data.list[index].approximateName,
        });
      }
    },
    onChange(e) {
      this.updateSelectionWithIndex(e.detail.value);
    },

    onColorPickerVisibleChange(e) {
      this.setData({ colorPickerVisible: e.detail.visible });
    },
    closeColorPicker() {
      this.setData({ colorPickerVisible: false });
    },

    onSelectedColor(e) {
      const selection = e.detail;
      this.setData({
        list: [...this.data.list.slice(0, -1), selection, ...this.data.list.slice(-1)],
      });
      setTimeout(() => {
        this.updateSelectionWithIndex(this.data.list.length - 2);
      }, 100);
      this.setData({ colorPickerVisible: false });
    },
  },
});
