import { getLocalUserInfo, fetchUserInfo } from '../../services/user/service';

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
    // 如果本地有用户信息则随带提交，否则以空对象提交（云函数会以 openid 去重）
    this.submitBooking(userInfo || {});
  },

  /**
   * 处理从微信获取到的加密手机号（open-type=getRealtimePhoneNumber 回调）
   */
  onGetRealTimePhoneNumber(e) {
    const code = e && e.detail && e.detail.code;
    if (!code) {
      wx.showToast({
        title: '获取手机号失败',
        icon: 'none',
      });
      return;
    }

    wx.showLoading({
      title: '获取手机号...',
    });

    wx.cloud
      .callFunction({
        name: 'verifyphonenumber',
        data: {
          code,
        },
      })
      .then((res) => {
        const phone = res && res.result && res.result.phoneNumber;
        if (!phone) {
          wx.showToast({
            title: '无法获取手机号',
            icon: 'none',
          });
          return;
        }

        // 将手机号填入输入框
        this.setData({
          phoneNumber: phone,
        });

        // 尝试拉取用户信息（若已在系统中存在），再提交预约；若失败也继续提交
        fetchUserInfo(phone)
          .then((userInfo) => {
            this.submitBooking(userInfo);
          })
          .catch(() => {
            this.submitBooking({ phoneNumber: phone });
          });
      })
      .catch((err) => {
        console.error('verifyphonenumber error', err);
        wx.showToast({
          title: '获取手机号失败',
          icon: 'none',
        });
      })
      .finally(() => {
        wx.hideLoading();
      });
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
