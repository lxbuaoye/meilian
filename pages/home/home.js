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
      .field({
        _id: true,
        title: true,
        price: true,
        tags: true,
      })
      .limit(4)
      .get();
    console.log(data);
    this.setData({
      productList: data,
    });
  },

  async loadShowcase() {
    const { data } = await db
      .collection('showcase')
      .field({
        _id: true,
        title: true,
        tags: true,
      })
      .limit(4)
      .get();
    console.log(data);
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
    console.log(data);
    this.setData({
      newsList: data,
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
});
