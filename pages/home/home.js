import Toast from 'tdesign-miniprogram/toast/index';
import dayjs from 'dayjs';

const db = wx.cloud.database();
const _ = db.command;
const { CLOUD_STROAGE_PATH } = getApp().globalData;

Page({
  data: {
    imgSrcs: [],
    tabList: [],
    productList: [],
    showcaseList: [],
    homeShowcaseFallbackImages: [`${CLOUD_STROAGE_PATH}/image/home/01.png`, `${CLOUD_STROAGE_PATH}/image/home/02.png`, `${CLOUD_STROAGE_PATH}/image/home/03.png`],
    homeShowcaseImageErrorMap: {},
    newsCoverImage: `${CLOUD_STROAGE_PATH}/image/home/1.png`,
    logoImage: `${CLOUD_STROAGE_PATH}/resources/logo1.png`,
    bannerImage: `${CLOUD_STROAGE_PATH}/resources/banner.png`,
    titleImage: `${CLOUD_STROAGE_PATH}/resources/title.png`,
    homeyuanImage: `${CLOUD_STROAGE_PATH}/resources/homeyuan.png`,
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
      bannerUrl: `${CLOUD_STROAGE_PATH}/resources/home/banner.png`,
      sloganUrl: `${CLOUD_STROAGE_PATH}/resources/home/slogan.png`,
      animateUrl: `${CLOUD_STROAGE_PATH}/resources/home/animate.png`,
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
        coverImageUrl: `${CLOUD_STROAGE_PATH}/showcase/${item._id}/cover.jpg`,
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
    try {
      const { data } = await db
        .collection('news')
        .field({
          _id: true,
          title: true,
          subtitle: true,
          description: true,
          sourceUrl: true,
          uploadDate: true,
        })
        .orderBy('uploadDate', 'desc')
        .limit(3)
        .get();
      const newsList = (data || []).map((item) => {
        return {
          ...item,
          uploadDateText: this.formatNewsDate(item.uploadDate),
        };
      });
      this.setData({
        newsList,
      });
    } catch (err) {
      console.error('loadNews failed:', err);
      this.setData({ newsList: [] });
      wx.showToast({
        title: '新闻加载失败',
        icon: 'none',
      });
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
