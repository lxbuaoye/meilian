import { getLocalUserInfo } from '../../services/user/service';

// pages/location/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuBarTop: 44,
    menuBarHeight: 32,
    phoneNumber: '',
    loginVisible: false,
    pendingBooking: false,
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
   * 立即预约
   */
  onBookNow() {
    const { phoneNumber } = this.data;
    if (!phoneNumber || phoneNumber.length !== 11) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
      });
      return;
    }

    const userInfo = getLocalUserInfo();
    if (!userInfo || !userInfo.phoneNumber) {
      this.setData({
        loginVisible: true,
        pendingBooking: true,
      });
      return;
    }

    this.submitBooking(userInfo);
  },

  onLoginSuccess(e) {
    const userInfo = e.detail;
    const { pendingBooking } = this.data;
    this.setData({
      loginVisible: false,
      pendingBooking: false,
    });
    if (pendingBooking) {
      this.submitBooking(userInfo);
    }
  },

  submitBooking(userInfo) {
    const { phoneNumber } = this.data;
    wx.showLoading({
      title: '提交中...',
    });
    wx.cloud
      .callFunction({
        name: 'saveuserbooking',
        data: {
          bookingPhoneNumber: phoneNumber,
          userPhoneNumber: userInfo && userInfo.phoneNumber ? userInfo.phoneNumber : '',
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
