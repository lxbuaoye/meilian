// components/index.ts
const productList = [
  {
    name: 'mosaic',
    mat: 'mat-mosaic',
    uniforms: 'u_baseColorMap: video-mosaic',
    videoCover: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/mosaic.png',
    videoSrc:
      'https://6469-digital-7gwdimnu0a14ab1b-1330344628.tcb.qcloud.la/resources/ar/mosaic2.mov?sign=9a9801934ecefff6d110911e2cdeb13d&t=1743669161',
  },
  {
    name: 'bucket',
    mat: 'mat-bucket',
    uniforms: 'u_baseColorMap: video-bucket',
    videoCover: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/bucket.png',
    videoSrc:
      'https://6469-digital-7gwdimnu0a14ab1b-1330344628.tcb.qcloud.la/resources/ar/bucket.mov?sign=a08199aa67f43569a6544ba1c5a67d96&t=1743746974',
  },
  {
    name: 'bag',
    mat: 'mat-bag',
    uniforms: 'u_baseColorMap: video-bag',
    videoCover: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/bag.png',
    videoSrc:
      'https://6469-digital-7gwdimnu0a14ab1b-1330344628.tcb.qcloud.la/resources/ar/bag2.mov?sign=824be9ff3cd45c5cf462159b5137195a&t=1743785149',
  },
  {
    name: 'shiqi_bucket',
    mat: 'mat-shiqi_bucket',
    uniforms: 'u_baseColorMap: video-shiqi_bucket',
    videoCover:
      'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/shiqi_bucket.png',
    videoSrc:
      'https://6469-digital-7gwdimnu0a14ab1b-1330344628.tcb.qcloud.la/resources/ar/shiqi_bucket.mp4?sign=25384f50b47102983d9db69060c5b0dd&t=1743785451',
  },
];

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoSrc: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    assetsLoaded: productList.map(() => {
      return false;
    }),
    productList,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleReady: function ({ detail }) {
      this.scene = detail.value;

      // wx.cloud.downloadFile({
      //   fileID: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/mosaic.mp4', // 对象存储文件ID，从上传文件接口或者控制台获取
      //   success: (res) => {
      //     this.setData({ videoSrc: res.tempFilePath });
      //   },
      //   fail: (err) => {
      //     console.error(err);
      //   },
      // });
    },
    handleAssetsLoaded: function (e) {
      const { detail } = e;
      const { name } = e.target.dataset;
      const index = productList.findIndex((element) => {
        return element.name === name;
      });

      this.setData({ [`assetsLoaded[${index}]`]: true });
    },
    handleTrackerSwitch: function (e) {
      const { detail } = e;
      const { name } = e.target.dataset;
      const active = detail.value;
      const video = this.scene.assets.getAsset('video-texture', name);
      active ? video.play() : video.stop();
    },
  },
});
