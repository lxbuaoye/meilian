
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
