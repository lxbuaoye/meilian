import { fetchHome } from '../../services/home/home';
import Toast from 'tdesign-miniprogram/toast/index';

const db = wx.cloud.database();
const _ = db.command;
const { CLOUD_STROAGE_PATH } = getApp().globalData;

Page({
  data: {
    imgSrcs: [],
    tabList: [],
    productList: [],
    showcaseList: [],
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
    this.setData({
      showcaseList: data,
    });
  },

  async loadNews() {
    const { data } = await db
      .collection('news')
      .field({
        _id: true,
        title: true,
        subtitle: true,
        description: true,
        uploadDate: true,
      })
      .limit(2)
      .get();
    this.setData({
      newsList: data,
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
    wx.switchTab({
      url: `/pages/product/index`,
    });
  },
  navigateToShowcase() {
    wx.switchTab({
      url: `/pages/showcase/index`,
    });
  },
  navigateToAnotherMiniProgram() {
    wx.navigateToMiniProgram({
      appId: 'wx0a81e9aa1745be90',
      envVersion: 'release',
    });
  },
  navigateToNews() {
    wx.navigateTo({
      url: `/pages/news/index`,
    });
  },
});
