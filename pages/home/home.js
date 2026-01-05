import Toast from 'tdesign-miniprogram/toast/index';
import dayjs from 'dayjs';

const db = wx.cloud.database();
const _ = db.command;
const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;

Page({
  data: {
    imgSrcs: [],
    tabList: [],
    productList: [],
    showcaseList: [],
    homeShowcaseFallbackImages: [`${CLOUD_IMAGE_BASE}/image/home/01.png`, `${CLOUD_IMAGE_BASE}/image/home/02.png`, `${CLOUD_IMAGE_BASE}/image/home/03.png`],
    homeShowcaseImageErrorMap: {},
    newsCoverImage: `${CLOUD_IMAGE_BASE}/image/home/1.png`,
    logoImage: `${CLOUD_IMAGE_BASE}/resources/logo1.png`,
    bannerImage: `${CLOUD_IMAGE_BASE}/resources/banner.png`,
    titleImage: `${CLOUD_IMAGE_BASE}/resources/title.png`,
    homeyuanImage: `${CLOUD_IMAGE_BASE}/resources/homeyuan.png`,
    newsList: [],
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: { type: 'dots' },
    swiperImageProps: { mode: 'scaleToFill' },
    popupVisible: false,
  },

  goodListPagination: {
    index: 0,
    num: 20,
  },

  privateData: {
    tabIndex: 0,
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.init();
  },

  onShareAppMessage() {},
  onShareTimeline() {
    return {
      title: `数码彩 - 出色涂装效果领航者`,
    };
  },
  onReachBottom() {},

  onPullDownRefresh() {
    this.init();
  },

  init() {
    const menuButton = wx.getMenuButtonBoundingClientRect();
    this.setData({
      menuBarTop: menuButton.top,
      menuBarHeight: menuButton.height,
    });
    // Load resources
    this.setData({
      bannerUrl: `${CLOUD_IMAGE_BASE}/resources/home/banner.png`,
      sloganUrl: `${CLOUD_IMAGE_BASE}/resources/home/slogan.png`,
      animateUrl: `${CLOUD_IMAGE_BASE}/resources/home/animate.png`,
    });
    this.loadHomePage();
  },

  loadHomePage() {
    wx.stopPullDownRefresh();
    this.loadProduct();
    this.loadShowcase();
    this.loadNews();
    this.setData({
      pageLoading: true,
    });
  },

  tabChangeHandle(e) {
    this.privateData.tabIndex = e.detail;
  },

  onReTry() {},

  async loadProduct() {
    const { data } = await db
      .collection('product')
      .where({
        category: _.eq('外墙漆'),
      })
      .orderBy('index', 'asc')
      .field({
        _id: true,
        title: true,
        price: true,
        tags: true,
        unit: true,
      })
      .limit(4)
      .get();
    this.setData({
      productList: data,
    });
  },

  async loadShowcase() {
    const { data } = await db
      .collection('showcase')
      .orderBy('index', 'asc')
      .field({
        _id: true,
        title: true,
        tags: true,
      })
      .limit(3)
      .get();
    const showcaseList = (data || []).map((item) => {
      return {
        ...item,
        coverImageUrl: `${CLOUD_IMAGE_BASE}/showcase/${item._id}/cover.jpg`,
      };
    });
    this.setData({
      showcaseList,
    });
  },

  onHomeShowcaseCoverError(e) {
    const id = e?.currentTarget?.dataset?.id;
    if (!id) return;
    this.setData({
      [`homeShowcaseImageErrorMap.${id}`]: true,
    });
  },

  async loadNews() {
    // 使用指定的三篇公众号文章内容替换首页新闻（由产品/运营提供）
    try {
      const staticNews = [
        {
          _id: 'news-1',
          title: '石意玲珑，历久弥新',
          subtitle:
            '业主常居东莞，因从事建材行业，对材质与细节尤为讲究，他曾收藏一块心仪的石材样本，希望将其色彩与纹理复刻于家中外墙。美联美墅团队据此独家调色，采用「水包砂深槽工艺」，配合窗套、鹰嘴、滴水线等全方位施工，不仅还原石材的肌理，更规避了石材的色差、成本高昂等问题。',
          sourceUrl: 'https://mp.weixin.qq.com/s/GP9ScvfOLJdoKaZsorAcnQ',
          uploadDate: '2025-12-30',
        },
        {
          _id: 'news-2',
          title: '美联嵄锦石：外墙仿石漆施工指南',
          subtitle:
            '麻点花岗岩效果：精准模仿传统麻点花岗岩的质感与色彩，提供煅烧面效果，麻点细腻逼真。轻质高效，用料节省：自重轻、负载小，超强耐候，绿色环保。附着力强，柔韧抗裂：漆膜柔韧，附着力强，适用于复杂造型墙面。',
          sourceUrl: 'https://mp.weixin.qq.com/s/Ngufi0hGMAVAtSmbVBCT7Q',
          uploadDate: '2025-12-29',
        },
        {
          _id: 'news-3',
          title: '当艺术遇见安心丨美联美墅X深时美术馆，共筑「深」诞奇妙夜！',
          subtitle:
            '圣诞的钟声已敲响对于孩子而言是童话，是闪闪发光的期待；而对于父母，最大的心愿或许是在绚烂之外为他们筑起一道安心的屏障，最好的礼物是陪伴，最棒的创作环境是安全。美联美墅与深时美术馆携手，开启这场特别亲子艺术之旅——「深」诞奇妙夜。',
          sourceUrl: 'https://mp.weixin.qq.com/s/JTlPHeOTM4rhHCdI3dH9OQ',
          uploadDate: '2025-12-25',
        },
      ];

      const newsList = staticNews.map((item) => ({
        ...item,
        uploadDateText: this.formatNewsDate(item.uploadDate),
      }));

      this.setData({
        newsList,
      });
    } catch (err) {
      console.error('loadNews (static) failed:', err);
      this.setData({ newsList: [] });
    }
  },

  formatNewsDate(value) {
    if (!value) return '';
    let normalizedValue = value;
    if (typeof normalizedValue === 'number') {
      // 兼容秒级(10位)与毫秒级(13位)时间戳
      if (normalizedValue > 0 && normalizedValue < 1e12) {
        normalizedValue = normalizedValue * 1000;
      }
    }
    const date = dayjs(normalizedValue);
    if (!date.isValid()) return '';
    return date.format('YYYY-MM-DD');
  },

  onNewsClick(e) {
    const url = e?.currentTarget?.dataset?.url;
    if (!url) {
      wx.showToast({
        title: '暂无链接',
        icon: 'none',
      });
      return;
    }
    wx.navigateTo({
      url: `/pages/webview/index?url=${encodeURIComponent(url)}`,
    });
  },
  closePopup() {
    this.setData({ popupVisible: false });
  },

  popupBonusScene(e) {
    var curTime = e.timeStamp; //获取时间戳
    var lastTime = this.data.lastTapTime; //第一次获取为零

    if (curTime - lastTime < 500) {
      this.setData({ clickNum: this.data.clickNum + 1 });
    } else {
      this.setData({ clickNum: 1 });
    }
    if (this.data.clickNum === 2) {
      this.setData({ popupVisible: true });
      console.log('点击2次，进入');
    }
    this.setData({
      lastTapTime: curTime,
    });
  },

  navToSearchPage() {
    wx.navigateTo({ url: '/pages/goods/search/index' });
  },

  navToActivityDetail({ detail }) {
    const { index: promotionID = 0 } = detail || {};
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${promotionID}`,
    });
  },

  navigateToProduct() {
    // 已删除产品列表页面，跳转到电子色卡
    wx.switchTab({
      url: `/pages/color-card/index`,
    });
  },
  navigateToShowcase() {
    wx.navigateTo({
      url: `/pages/showcase-list/index`,
    });
  },
  navigateToShowcaseDetail(e) {
    const id = e?.currentTarget?.dataset?.id;
    if (!id) return;
    wx.navigateTo({
      url: `/pages/showcase-detail/index?id=${id}`,
    });
  },
  navigateToAnotherMiniProgram() {
    wx.navigateToMiniProgram({
      appId: 'wx0a81e9aa1745be90',
      envVersion: 'release',
    });
  },
  navigateToNews() {
    // 已删除新闻页面
    wx.showToast({
      title: '功能暂未开放',
      icon: 'none',
    });
  },

  // addcoupon() {
  //   wx.cloud
  //     .callFunction({
  //       // 云函数名称
  //       name: 'generatecoupon',
  //       // 传给云函数的参数
  //       data: {},
  //     })
  //     .then((res) => {
  //       console.log(res);
  //     });
  // },
  generateqrcode() {
    wx.cloud
      .callFunction({
        // 云函数名称
        name: 'qrcode',
        // 传给云函数的参数
        data: {},
      })
      .then((res) => {
        console.log(res);
      });
  },
});
