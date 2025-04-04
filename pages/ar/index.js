// index.ts

Component({
  data: {
    motto: 'Hello World',
    width: 300,
    height: 300,
    renderWidth: 300,
    renderHeight: 300,
    loaded: false,
    assetsLoaded: false,
    videoSrc: '',
    positions: [
      [0, 0, 'rgba(44, 44, 44, 0.5)', ''],
      [0, 0, 'rgba(44, 44, 44, 0.5)', ''],
    ],
  },

  lifetimes: {
    attached: function () {
      const info = wx.getSystemInfoSync();
      const width = info.windowWidth;
      const height = info.windowHeight;
      const dpi = info.pixelRatio;
      this.setData({
        width,
        height,
        renderWidth: width * dpi,
        renderHeight: height * dpi,
      });

      this.setData({ assetsLoaded: true });
      // wx.cloud.downloadFile({
      //   fileID: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/mosaic.mp4', // 对象存储文件ID，从上传文件接口或者控制台获取
      //   success: (res) => {
      //     console.log(res.tempFilePath);
      //     this.setData({ assetsLoaded: true });
      //   },
      //   fail: (err) => {
      //     console.error(err);
      //   },
      // });
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    handleLoaded: function ({ detail }) {
      this.setData({ loaded: true });
    },
    handleSyncPositions: function ({ detail }) {
      this.setData({ positions: detail });
    },
  },
});
