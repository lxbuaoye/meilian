import { getLocalUserInfo, fetchUserInfo } from '../../services/user/service';

import Message from 'tdesign-miniprogram/message/index';

const { CLOUD_IMAGE_BASE } = getApp().globalData;
const accountInfo = wx.getAccountInfoSync();
const db = wx.cloud.database();
const _ = db.command;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    usingCustomNavbar: {
      type: Boolean,
      value: false,
    },
    header: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    loginLoadingVisible: false,
    logoSrc: `${CLOUD_IMAGE_BASE}/resources/ai/logo.png`,
    navigatorProps: {
      // 已删除隐私页面
      // url: '/pages/ai/privacy/index',
    },
    privacyChecked: false,
    debugMode: accountInfo.miniProgram.envVersion === 'develop',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getMessageOffset() {
      return this.data.usingCustomNavbar ? [90, 32] : [20, 32];
    },

    tryGetUserInfo(phoneNumber) {
      try {
        fetchUserInfo(phoneNumber).then((userInfo) => {
          this.setData({ loginLoadingVisible: false });
          this.triggerEvent('onloginsuccess', userInfo);
        });
      } catch (e) {
        this.setData({ loginLoadingVisible: false });
        this.showErrorPopup();
      }
    },

    verifyPhoneNumber(e) {
      this.setData({ loginLoadingVisible: true });
      wx.cloud
        .callFunction({
          // 云函数名称
          name: 'verifyphonenumber',
          // 传给云函数的参数
          data: {
            code: e.detail.code,
          },
        })
        .then((res) => {
          this.tryGetUserInfo(res.result.phoneNumber, true);
        })
        .catch((err) => {
          Message.error({
            context: this,
            offset: this.getMessageOffset(),
            duration: 3000,
            content: '无法获取手机号, 请重试',
          });
          this.setData({ loginLoadingVisible: false });
          console.error(err);
        });
    },

    showErrorPopup(text) {
      Message.error({
        context: this,
        offset: this.getMessageOffset(),
        duration: 3000,
        content: `服务器出错 ${text ? ` ${text}` : ''}`,
      });
    },

    debugLogin() {
      this.tryGetUserInfo('19876036402');
    },

    onPrivacyChange(e) {
      this.setData({ privacyChecked: e.detail.checked });
    },
  },
});
