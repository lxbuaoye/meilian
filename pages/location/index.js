
const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;

// pages/location/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuBarTop: 44,
    menuBarHeight: 32,
    phoneNumber: '',
    userName: '',
    storeAppointmentPic: `${CLOUD_IMAGE_BASE}/image/location/store_appointment_pic@2x.png`,
    industryNewHeightPic: `${CLOUD_IMAGE_BASE}/image/location/industry_new_height_pic@2x.png`,
    phoneIcon: `${CLOUD_IMAGE_BASE}/image/location/phone@2x.png`,
    phoneIconAlt: `${CLOUD_IMAGE_BASE}/image/location/phone@2x_1.png`,
    logoImage: `${CLOUD_IMAGE_BASE}/resources/logo1.png`,
    // tabs populated from cloud 'reservation' collection
    tabs: [],
    activeTab: 0,
    // dynamic image heights (rpx) for images
    imageHeights: [],
    currentImageHeight: 450,
    // scroll position and layout offsets
    scrollTop: 0,
    tabsHeight: 100, // rpx - used to compute content margin
    contentMarginTop: 0,
    tabBarHeightRpx: 68,
    bottomFixedHeightRpx: 120,
    contentPaddingBottom: 0,
  },
  /**
   * 打开预约弹窗
   */
  openBookingModal() {
    this.setData({
      bookingModalVisible: true,
      // initialize projects if not present
      projects: this.data.projects && this.data.projects.length ? this.data.projects : ['墙面刷新', '厨卫改造', '防水修缮'],
      selectedProjectIndex: typeof this.data.selectedProjectIndex === 'number' ? this.data.selectedProjectIndex : -1,
    });
  },

  /**
   * 关闭预约弹窗
   */
  closeBookingModal() {
    this.setData({
      bookingModalVisible: false,
    });
  },

  onBookingNameInput(e) {
    this.setData({ bookingName: e.detail.value });
  },
  onBookingPhoneInput(e) {
    this.setData({ bookingPhone: e.detail.value });
  },
  onBookingCommunityInput(e) {
    this.setData({ bookingCommunity: e.detail.value });
  },
  onBookingDetailInput(e) {
    this.setData({ bookingDetailAddress: e.detail.value });
  },

  /**
   * 调用微信选点（选择位置/城市）
   */
  onChooseLocation() {
    if (!wx.chooseLocation) {
      wx.showToast({ title: '当前环境不支持选点', icon: 'none' });
      return;
    }
    wx.chooseLocation({
      success: (res) => {
        const address = res.address || res.name || '';
        this.setData({ bookingArea: address });
      },
      fail: (err) => {
        console.warn('chooseLocation fail', err);
      },
    });
  },

  onSelectProject(e) {
    const idx = Number(e.currentTarget.dataset.index);
    if (Number.isNaN(idx)) return;
    this.setData({ selectedProjectIndex: idx });
  },

  submitBookingModal() {
    const {
      bookingName,
      bookingPhone,
      bookingArea,
      bookingCommunity,
      bookingDetailAddress,
      selectedProjectIndex,
      projects,
    } = this.data;
    if (!bookingName || !bookingPhone) {
      wx.showToast({ title: '请填写姓名和电话', icon: 'none' });
      return;
    }
    const project = projects && selectedProjectIndex >= 0 ? projects[selectedProjectIndex] : '';
    wx.showLoading({ title: '提交中...' });
    wx.cloud
      .callFunction({
        name: 'saveuserbooking',
        data: {
          bookingName,
          bookingPhone,
          bookingArea,
          bookingCommunity,
          bookingDetailAddress,
          bookingProject: project,
        },
      })
      .then((res) => {
        wx.hideLoading();
        wx.showToast({ title: '提交成功', icon: 'success' });
        this.setData({ bookingModalVisible: false });
      })
      .catch((err) => {
        wx.hideLoading();
        console.error('submitBookingModal error', err);
        wx.showToast({ title: '提交失败', icon: 'none' });
      });
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
    // load reservation tabs and images
    this.loadReservationTabs();
  },

  /**
   * 从云数据库 reservation 中读取 lx 和 tpdz，用于顶部选项卡与主图
   */
  loadReservationTabs() {
    if (!wx.cloud || !wx.cloud.database) {
      console.warn('wx.cloud not available');
      return;
    }
    const db = wx.cloud.database();
    db.collection('reservation')
      .get()
      .then((res) => {
        const items = (res && res.data) || [];
        if (!items.length) return;
        const tabs = items.map((it) => ({
          lx: it.lx || '',
          tpdz: it.tpdz || '',
        }));
        // set first image as main if available
        const firstPic = tabs[0] && tabs[0].tpdz ? tabs[0].tpdz : this.data.storeAppointmentPic;
        // initialize imageHeights with default values and compute content margin top in px
        const imageHeights = tabs.map(() => 450);
        const sys = wx.getSystemInfoSync ? wx.getSystemInfoSync() : { windowWidth: 375 };
        const windowWidth = sys.windowWidth || 375;
        const tabsHeightRpx = this.data.tabsHeight || 100;
        const tabsHeightPx = Math.round((tabsHeightRpx * windowWidth) / 750);
        const contentMarginTop = (this.data.menuBarTop || 0) + (this.data.menuBarHeight || 0) + tabsHeightPx;
        this.setData({
          tabs,
          storeAppointmentPic: firstPic,
          activeTab: 0,
          imageHeights,
          currentImageHeight: imageHeights[0] || 450,
          contentMarginTop,
        });
        // compute content padding bottom so content is not hidden behind bottom-fixed + tabBar safe area
        const bottomFixed = this.data.bottomFixedHeightRpx || 120;
        const tabBar = this.data.tabBarHeightRpx || 68;
        // add extra 120rpx bottom margin to ensure image content is not obscured
        const contentPaddingBottom = bottomFixed + tabBar + 120;
        this.setData({ contentPaddingBottom });
        // ensure scrollTop is reset
        this.setData({ scrollTop: 0 });
      })
      .catch((err) => {
        console.error('loadReservationTabs error', err);
      });
  },

  /**
   * 选项卡点击
   */
  onTabTap(e) {
    const idx = Number(e.currentTarget.dataset.index);
    if (Number.isNaN(idx)) return;
    const tab = (this.data.tabs || [])[idx];
    if (!tab) return;
    this.setData({
      activeTab: idx,
      storeAppointmentPic: tab.tpdz || this.data.storeAppointmentPic,
      currentImageHeight: (this.data.imageHeights && this.data.imageHeights[idx]) || this.data.currentImageHeight,
    });
    // scroll content to top so user sees top of new image
    this.setData({ scrollTop: 0 });
  },

  onImageLoad(e) {
    try {
      const datasetIndex = e.currentTarget.dataset.index;
      const index = Number(datasetIndex >= 0 ? datasetIndex : 0);
      const origW = e.detail.width;
      const origH = e.detail.height;
      if (!origW || !origH) return;
      // convert to rpx based on original image ratio: rpx = origH * 750 / origW
      const heightRpx = Math.round((origH * 750) / origW);
      const imageHeights = Array.isArray(this.data.imageHeights) ? this.data.imageHeights.slice() : [];
      imageHeights[index] = heightRpx;
      this.setData({
        imageHeights,
      });
      if (this.data.activeTab === index) {
        this.setData({
          currentImageHeight: heightRpx,
        });
      }
    } catch (err) {
      console.warn('onImageLoad error', err);
    }
  },

  /**
   * 当 swiper 切换时同步 activeTab 与高度
   */
  onSwiperChange(e) {
    const idx = e && e.detail && typeof e.detail.current === 'number' ? e.detail.current : 0;
    this.setData({
      activeTab: idx,
      currentImageHeight: (this.data.imageHeights && this.data.imageHeights[idx]) || this.data.currentImageHeight,
    });
  },

  onShareTap() {
    // simple share action placeholder
    if (wx.showShareMenu) {
      wx.showShareMenu({ withShareTicket: true });
    }
    wx.showToast({ title: '分享', icon: 'none' });
  },

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
    // ensure bottom action bar sits above custom tabBar; default to 68rpx
    // If custom tabBar provides a height value, the page can set this.data.tabBarHeightRpx accordingly.
    this.setData({
      tabBarHeightRpx: 68,
    });
    setTimeout(() => {
      try {
        if (this.getTabBar && typeof this.getTabBar === 'function') {
          const tabBar2 = this.getTabBar();
          if (tabBar2 && typeof tabBar2.init === 'function') tabBar2.init();
        }
      } catch (e) {}
    }, 120);
  },

  /**
   * 电话号码输入
   */
  onPhoneInput(e) {
    this.setData({
      phoneNumber: e.detail.value,
    });
  },

  /**
   * 姓名输入
   */
  onNameInput(e) {
    this.setData({
      userName: e.detail.value,
    });
  },

  /**
   * 验证手机号格式
   */
  validatePhoneNumber(phoneNumber) {
    // 检查是否为空
    if (!phoneNumber || phoneNumber.trim() === '') {
      return { valid: false, message: '请输入手机号码' };
    }

    // 检查长度是否为11位
    if (phoneNumber.length !== 11) {
      return { valid: false, message: '手机号码必须为11位数字' };
    }

    // 检查是否全为数字
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      return { valid: false, message: '手机号码只能包含数字' };
    }

    // 检查是否以1开头
    if (!phoneNumber.startsWith('1')) {
      return { valid: false, message: '手机号码必须以1开头' };
    }

    return { valid: true };
  },

  /**
   * 立即预约
   */
  onBookNow() {
    const { phoneNumber, userName } = this.data;

    // 验证手机号
    const phoneValidation = this.validatePhoneNumber(phoneNumber);
    if (!phoneValidation.valid) {
      wx.showToast({
        title: phoneValidation.message,
        icon: 'none',
      });
      return;
    }
    if (!userName || userName.trim() === '') {
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none',
      });
      return;
    }
    // 直接提交预约信息到云函数
    this.submitBooking();
  },


  submitBooking() {
    const { phoneNumber, userName } = this.data;
    wx.showLoading({
      title: '提交中...',
    });
    wx.cloud
      .callFunction({
        name: 'saveuserbooking',
        data: {
          bookingPhoneNumber: phoneNumber,
          bookingName: userName,
        },
      })
      .then((res) => {
        const result = res && res.result ? res.result : {};
        if (result && result.success) {
          wx.showToast({
            title: result.alreadySubmitted ? '已提交预约' : '预约提交成功',
            icon: result.alreadySubmitted ? 'none' : 'success',
          });
          this.setData({
            phoneNumber: '',
            userName: '',
          });
          return;
        }
        wx.showToast({
          title: (result && result.message) || '预约提交失败',
          icon: 'none',
        });
      })
      .catch((err) => {
        console.error('saveuserbooking error', err);
        wx.showToast({
          title: '预约提交失败',
          icon: 'none',
        });
      })
      .finally(() => {
        wx.hideLoading();
      });
  },

  /**
   * 在线客服
   */
  onOnlineService() {
    // TODO: 打开在线客服
    wx.showToast({
      title: '正在连接客服...',
      icon: 'none',
    });
  },

  /**
   * 电话咨询
   */
  onPhoneConsult() {
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
