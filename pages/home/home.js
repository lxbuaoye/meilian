import { fetchHome } from '../../services/home/home';
import { fetchGoodsList } from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';

const { CLOUD_STROAGE_PATH } = getApp().globalData;

Page({
  data: {
    imgSrcs: [],
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
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

    this.setData({
      pageLoading: true,
    });
  },

  tabChangeHandle(e) {
    this.privateData.tabIndex = e.detail;
  },

  onReTry() {},

  goodListAddCartHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加入购物车',
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
});
