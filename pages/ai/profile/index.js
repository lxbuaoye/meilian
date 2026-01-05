// pages/ai/profile/index.js
const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuBarTop: 0,
    menuBarHeight: 44,
    honorCurrent: 0,
    honorCerts: [
      {
        src: `${CLOUD_IMAGE_BASE}/image/ai/Image%201.png`,
        desc: '质量管理体系认证证书',
      },
      {
        src: `${CLOUD_IMAGE_BASE}/image/ai/Image%201%281%29.png`,
        desc: '职业健康安全管理体系认证证书',
      },
      {
        src: `${CLOUD_IMAGE_BASE}/image/ai/Image%201%282%29.png`,
        desc: '安全生产标准化证书',
      },
    ],
    honorDesc: '质量管理体系认证证书',
    honorPreviewVisible: false,
    honorPreviewCurrent: 0,
    bannerImage: `${CLOUD_IMAGE_BASE}/image/ai/banner@2x.png`,
    cultureImage: `${CLOUD_IMAGE_BASE}/image/ai/corporate_culture_pic@2x.png`,
    conceptImage: `${CLOUD_IMAGE_BASE}/image/ai/brand_concept@2x.png`,
    honorBg: `${CLOUD_IMAGE_BASE}/image/ai/glory_qualification_bg@2x.png`,
    leftArrow: `${CLOUD_IMAGE_BASE}/image/ai/left.png`,
    rightArrow: `${CLOUD_IMAGE_BASE}/image/ai/right_arrow.png`,
    patentsImage: `${CLOUD_IMAGE_BASE}/image/ai/260_patent@2x.png`,
    navigatorImage: `${CLOUD_IMAGE_BASE}/image/ai/navigator@2x.png`,
    phoneIcon: `${CLOUD_IMAGE_BASE}/image/ai/one_click_call@2x.png`,
    qrCode1: `${CLOUD_IMAGE_BASE}/image/ai/qr_code_1@2x.png`,
    qrCode2: `${CLOUD_IMAGE_BASE}/image/ai/qr_code_2@2x.png`,
    logoImage: `${CLOUD_IMAGE_BASE}/resources/logo1.png`,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const menuButton = wx.getMenuButtonBoundingClientRect();
    this.setData({
      menuBarTop: menuButton.top,
      menuBarHeight: menuButton.height,
    });
  },

  onHonorSwiperChange(e) {
    const current = e.detail.current;
    const cert = this.data.honorCerts[current];
    this.setData({
      honorCurrent: current,
      honorDesc: cert ? cert.desc : '',
    });
  },

  prevHonor() {
    const total = this.data.honorCerts.length;
    if (!total) return;
    const nextIndex = (this.data.honorCurrent - 1 + total) % total;
    this.setData({
      honorCurrent: nextIndex,
      honorDesc: this.data.honorCerts[nextIndex].desc,
    });
  },

  nextHonor() {
    const total = this.data.honorCerts.length;
    if (!total) return;
    const nextIndex = (this.data.honorCurrent + 1) % total;
    this.setData({
      honorCurrent: nextIndex,
      honorDesc: this.data.honorCerts[nextIndex].desc,
    });
  },

  onHonorCertTap(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (Number.isNaN(index)) return;

    this.setData({
      honorPreviewVisible: true,
      honorPreviewCurrent: index,
    });
  },

  onHonorPreviewChange(e) {
    const current = e.detail.current;
    const cert = this.data.honorCerts[current];
    this.setData({
      honorPreviewCurrent: current,
      honorDesc: cert ? cert.desc : '',
      honorCurrent: current,
    });
  },

  closeHonorPreview() {
    this.setData({
      honorPreviewVisible: false,
    });
  },

  noop() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (this.getTabBar && typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar();
      if (tabBar && typeof tabBar.init === 'function') {
        tabBar.init();
      }
    }
  },

  /**
   * 拨打电话
   */
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: '400-080-1633',
      fail: (err) => {
        console.error('拨打电话失败', err);
        wx.showToast({
          title: '拨打电话失败',
          icon: 'none',
        });
      },
    });
  },
});
