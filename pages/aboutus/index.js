const { CLOUD_STROAGE_PATH } = getApp().globalData;

const db = wx.cloud.database();
const _ = db.command;

const advantageList = [
  {
    imageSrc: `${CLOUD_STROAGE_PATH}/resources/about-us/0.png`,
    title: '数码彩仿大理石漆',
    subtitle: '浑然天成 · 效果逼真',
  },
  {
    imageSrc: `${CLOUD_STROAGE_PATH}/resources/about-us/1.png`,
    title: '艺术 · 墙漆',
    subtitle: '艺术漆的效果，乳胶漆的价格',
  },
  {
    imageSrc: `${CLOUD_STROAGE_PATH}/resources/about-us/2.png`,
    title: '专业产品+工艺',
    subtitle: '出色效果，由您演绎，十大家装漆涂装效果',
  },
  {
    imageSrc: `${CLOUD_STROAGE_PATH}/resources/about-us/3.png`,
    title: '省工 + 省时 = 省钱',
    subtitle: '直接在水泥/瓷砖/马赛克上涂刷',
  },
  {
    imageSrc: `${CLOUD_STROAGE_PATH}/resources/about-us/4.png`,
    title: '从新项目全屋翻新',
    subtitle: '家里所有的东西，都能全部翻新',
  },
  {
    imageSrc: `${CLOUD_STROAGE_PATH}/resources/about-us/5.png`,
    title: '全屋防水解决方案',
    subtitle: '新家防水一刷用不漏，旧家补漏即刷即修复',
  },
  {
    imageSrc: `${CLOUD_STROAGE_PATH}/resources/about-us/6.png`,
    title: '家居环保基装一体化',
    subtitle: '提供全面专业的辅助材料',
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
  },
  onLoad(options) {
    this.setData({
      bannerUrl: `${CLOUD_STROAGE_PATH}/resources/about-us/banner.png`,
      cultureUrl: `${CLOUD_STROAGE_PATH}/resources/about-us/culture.png`,
      advantageUrl: `${CLOUD_STROAGE_PATH}/resources/about-us/advantage.png`,
      swiperBackgroundUrl: `${CLOUD_STROAGE_PATH}/resources/about-us/swiperBackground.png`,
    });
    this.init();
  },

  async init() {
    const { data } = await db.collection('certificate').orderBy('index', 'asc').limit(8).get();
    this.setData({
      swiperList: data.map((item) => {
        return {
          name: item.name,
          imageSrc: `${CLOUD_STROAGE_PATH}/resources/certificate/${item.imageSrc}`,
        };
      }),
    });
    console.log(this.data.swiperList);
  },

  previewImage(e) {
    wx.previewImage({
      current: this.data.swiperList[e.currentTarget.dataset.index].imageSrc, // 当前显示图片的http链接
      urls: this.data.swiperList.map((item) => {
        return item.imageSrc;
      }),
    });
  },

  onShow() {
    this.getTabBar().init();
  },
  onShareAppMessage() {},
});
