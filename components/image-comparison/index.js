// components/image-comparison/image-comparison.js
Component({
  // 定义组件的属性，用于从外部传入数据
  properties: {
    beforeImage: {
      type: String,
      value: '',
    },
    afterImage: {
      type: String,
      value: '',
    },
  },

  data: {
    revealPosition: 50,
    containerLeft: 0,
    containerWidth: 0,
  },

  lifetimes: {
    attached() {
      // 在组件挂载到页面时获取容器信息
      this.getContainerInfo();
    },
  },

  methods: {
    getContainerInfo() {
      // 获取容器的尺寸和位置
      const query = this.createSelectorQuery();
      query
        .select('.container')
        .boundingClientRect((res) => {
          if (res) {
            this.setData({
              containerLeft: res.left,
              containerWidth: res.width,
            });
          }
        })
        .exec();
    },

    handleTouchStart() {
      // 确保在触摸开始时重新获取容器信息，以防万一
      this.getContainerInfo();
    },

    handleTouchMove(e) {
      const touch = e.touches[0];
      let x = touch.clientX - this.data.containerLeft;

      if (x < 0) {
        x = 0;
      }
      if (x > this.data.containerWidth) {
        x = this.data.containerWidth;
      }

      const percentage = (x / this.data.containerWidth) * 100;

      this.setData({
        revealPosition: percentage,
      });
    },
  },
});
