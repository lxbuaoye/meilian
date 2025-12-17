// components/userHeader/index.js
import {
  getLocalUserInfo,
  fetchUserInfo,
  saveUserHistoryLocally,
  saveUserInfoLocally,
} from '../../services/user/service';

const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
  },
  attached() {
    const userInfo = getLocalUserInfo();
    if (userInfo && userInfo.phoneNumber) {
      this.setData({ userInfo });
    }

    // Listen for score updates
    this.userInfoUpdateHandler = (newUserInfo) => {
      this.setData({
        userInfo: newUserInfo,
      });
    };
    app.eventBus.on('userInfoUpdated', this.userInfoUpdateHandler);
  },
  detached() {
    // Crucial: remove the listener
    app.eventBus.off('userInfoUpdated', this.userInfoUpdateHandler);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkUserLoginStatus() {
      if (!this.data.userInfo || !this.data.userInfo.phoneNumber) {
        this.triggerEvent('unauthorized', { message: '用户未登录，请先登录！' });
        return false;
      }
      return true;
    },

    navigateToProfile() {
      if (!this.checkUserLoginStatus()) {
        return;
      }
      wx.navigateTo({
        url: '/pages/ai/profile/index',
      });
    },
    navigateToPayment() {
      if (!this.checkUserLoginStatus()) {
        return;
      }
      wx.navigateTo({
        url: '/pages/ai/payment/index',
      });
    },
  },
});
