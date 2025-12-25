// components/index.ts
const productList = [
  {
    name: 'mosaic',
    mat: 'mat-mosaic',
    uniforms: 'u_baseColorMap: video-mosaic',
    videoCover: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/mosaic.png',
    videoSrc:
      'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la/resources/ar/mosaic2.mov?sign=9a9801934ecefff6d110911e2cdeb13d&t=1743669161',
  },
  {
    name: 'bucket',
    mat: 'mat-bucket',
    uniforms: 'u_baseColorMap: video-bucket',
    videoCover: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/bucket.png',
    videoSrc:
      'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la/resources/ar/bucket.mov?sign=a08199aa67f43569a6544ba1c5a67d96&t=1743746974',
  },
  {
    name: 'bucket2',
    mat: 'mat-bucket2',
    uniforms: 'u_baseColorMap: video-bucket2',
    videoCover: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/bucket2.png',
    videoSrc:
      'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la/resources/ar/bucket.mov?sign=a08199aa67f43569a6544ba1c5a67d96&t=1743746974',
  },
  {
    name: 'bag',
    mat: 'mat-bag',
    uniforms: 'u_baseColorMap: video-bag',
    videoCover: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/bag.png',
    videoSrc:
      'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la/resources/ar/bag2.mov?sign=824be9ff3cd45c5cf462159b5137195a&t=1743785149',
  },
  {
    name: 'shiqi_bucket',
    mat: 'mat-shiqi_bucket',
    uniforms: 'u_baseColorMap: video-shiqi_bucket',
    videoCover:
      'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/shiqi_bucket.png',
    videoSrc:
      'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la/resources/ar/shiqi_bucket.mp4?sign=81c647af60e1f3c7905bed2399cb10e8&t=1744643302',
  },
  {
    name: 'requirement',
    mat: 'mat-requirement',
    uniforms: 'u_baseColorMap: video-requirement',
    videoCover:
      'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/requirement.jpg',
    videoSrc:
      'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la/resources/ar/requirement.mp4?sign=f43ab92806ff9ba8439db6aaad234837&t=1744641888',
  },
  {
    name: 'standard',
    mat: 'mat-standard',
    uniforms: 'u_baseColorMap: video-standard',
    videoCover: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/standard3.png',
    videoSrc:
      'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la/resources/ar/standard.mp4?sign=79ead91d95a3d162b7d2206f6b04fe49&t=1744641768',
  },
  {
    name: 'shuwu',
    mat: 'mat-shuwu',
    uniforms: 'u_baseColorMap: video-shuwu',
    videoCover: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/shuwu.png',
    videoSrc:
      'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la/resources/ar/shuwu.mov?sign=34f6548b306f11c4a5d69780b382938e&t=1744643452',
    scale: '1.79 1 1',
  },
  {
    name: 'jieba',
    mat: 'mat-jieba',
    uniforms: 'u_baseColorMap: video-jieba',
    videoCover: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/jieba.jpg',
    videoSrc:
      'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la/resources/ar/jieba.mov?sign=685bd30620c791b8e1b2b2fab753194c&t=1744643564',
  },
  {
    name: 'today',
    mat: 'mat-today',
    uniforms: 'u_baseColorMap: video-today',
    videoCover: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/today.jpg',
    videoSrc:
      'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la/resources/ar/today.mp4?sign=1f3129cb9f036f82a5fff4cdf0252c54&t=1744645784',
    scale: '1.79 1 1',
  },
  {
    name: 'shupudiqi',
    mat: 'mat-shupudiqi',
    uniforms: 'u_baseColorMap: video-shupudiqi',
    videoCover: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/ar/shupudiqi.jpg',
    videoSrc:
      'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la/resources/ar/shupudiqi.mp4?sign=32c4064316a6dde9b2f388b39e646f0d&t=1744645920',
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
