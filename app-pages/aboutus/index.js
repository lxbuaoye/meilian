const { CLOUD_STROAGE_PATH } = getApp().globalData;

const db = wx.cloud.database();
const _ = db.command;

const QR_CODE = `${CLOUD_STROAGE_PATH}/resources/contact-us/qr_code.jpg`;
const address = {
  latitude: '22.773652',
  longitude: '113.19467',
};

const advantageList = [
  {
    imageSrc: `${CLOUD_STROAGE_PATH}/resources/about-us/3.png`,
    title: '省工 + 省时 = 省钱',
    subtitle: '可直接在水泥/瓷砖/马赛克等基层涂刷',
  },
  {
    imageSrc: `${CLOUD_STROAGE_PATH}/resources/about-us/0.png`,
    title: '极致的品质',
    subtitle: '晒着卖的白漆, 洗着卖的乳胶漆, 泡着卖的石漆',
  },
  {
    imageSrc: `${CLOUD_STROAGE_PATH}/resources/about-us/1.png`,
    title: '逼真的石材效果',
    subtitle: '仿大理石效果浑然天成，真仿难辨',
  },
  {
    imageSrc: `${CLOUD_STROAGE_PATH}/resources/about-us/2.png`,
    title: '个性化定制',
    subtitle: '艺术墙漆，艺术生活',
  },
  {
    imageSrc: `${CLOUD_STROAGE_PATH}/resources/about-us/4.png`,
    title: '从新项目全屋翻新',
    subtitle: '眼睛看到的，都有翻新解决方案',
  },
  {
    imageSrc: `${CLOUD_STROAGE_PATH}/resources/about-us/6.png`,
    title: '家居环保基装一体化',
    subtitle: '提供全面配套的专用辅助材料',
  },
];

Page({
  data: {
    current: 0,
    autoplay: false,
    duration: 500,
    interval: 5000,
    swiperList: [],
    advantageList,
    QR_CODE,
    ...address,
    markers: [
      {
        latitude: '22.773652',
        longitude: '113.19467',
      },
    ],
  },
  onLoad(options) {
    this.setData({
      bannerUrl: `${CLOUD_STROAGE_PATH}/resources/about-us/banner.png`,
      cultureUrl: `${CLOUD_STROAGE_PATH}/resources/about-us/culture.png`,
      advantageUrl: `${CLOUD_STROAGE_PATH}/resources/about-us/ipad_advantage.png`,
      advantageIconUrl: `${CLOUD_STROAGE_PATH}/resources/about-us/advantageIcon.png`,
      swiperBackgroundUrl: `${CLOUD_STROAGE_PATH}/resources/about-us/swiperBackground.png`,
    });
    this.init();
  },

  async init() {
    const { data } = await db.collection('certificate').orderBy('index', 'asc').limit(8).get();
    this.setData({
      swiperList: data.map((item) => {
        const imageUrl = item.imageSrc;
        const index = imageUrl.lastIndexOf('.');
        const extension = imageUrl.substring(imageUrl.lastIndexOf('.'));
        return {
          name: item.name,
          imageSrc: `${CLOUD_STROAGE_PATH}/resources/certificate/${item.imageSrc}`,
          imageSrcHiRes: `${CLOUD_STROAGE_PATH}/resources/certificate/${imageUrl.substring(0, index)}@2x${extension}`,
        };
      }),
    });
    console.log(this.data.swiperList);
  },

  previewImage(e) {
    wx.previewImage({
      current: this.data.swiperList[e.currentTarget.dataset.index].imageSrcHiRes, // 当前显示图片的http链接
      urls: this.data.swiperList.map((item) => {
        return item.imageSrcHiRes;
      }),
    });
  },

  onShow() {
    this.getTabBar().init();
  },
  onShareAppMessage() {},
  onShareTimeline() {
    return {
      title: `数码彩 - 出色涂装效果领航者`,
    };
  },

  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: '4008383377',
    });
  },

  openLoation() {
    wx.openLocation({
      //​使用微信内置地图查看位置。
      latitude: 22.773652,
      longitude: 113.19467,
      name: '数码彩涂料有限公司',
      address: '广东省佛山市顺德区杏坛镇科技区九路13号',
    });
  },
});
