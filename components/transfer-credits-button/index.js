import { getLocalUserInfo, saveUserInfoLocally } from '../../services/user/service';
import { Toast } from 'tdesign-miniprogram';

const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;
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
    backgroundSrc: `${CLOUD_IMAGE_BASE}/resources/ai/profile/transfer_credits_background.png`,
    transferCreditsPopupVisible: false,
    transferring: false,
    pointsOptions: [10, 100, 500],
    selectedPoint: null,
    customPoint: null,
    // 新增：赠送用户的手机号码
    userPhone: null,
  },

  lifetimes: {
    attached() {
      const userInfo = getLocalUserInfo();
      if (userInfo && userInfo.phoneNumber) {
        this.setData({ userInfo });
      }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 1. 处理固定积分按钮的点击事件
    onSelectPoint: function (e) {
      const { value } = e.currentTarget.dataset;
      this.setData({
        selectedPoint: value,
        customPoint: null, // 选中固定积分时，清空自定义积分
      });
    },

    // 2. 处理自定义输入框的输入事件
    onInputCustomPoint: function (e) {
      this.setData({
        customPoint: e.detail.value,
        selectedPoint: null, // 输入自定义积分时，取消固定积分的选择
      });
    },

    // 3. 处理输入框获取焦点的事件
    onFocusCustomPoint: function () {
      this.setData({
        selectedPoint: null,
      });
    },

    // 4. 新增：处理赠送用户手机号的输入事件
    onInputUserPhone: function (e) {
      this.setData({
        userPhone: e.detail.value,
      });
    },

    // 5. 新增：处理确定按钮的提交事件
    onSubmit() {
      // 获取最终的积分值
      const finalPoints = this.data.selectedPoint || this.data.customPoint;
      const { userPhone } = this.data;

      // 简单的前端校验
      if (!finalPoints) {
        wx.showToast({
          title: '请选择或输入转赠面额',
          icon: 'none',
        });
        return;
      }

      // 校验2：如果是自定义积分，检查是否为10的整数倍
      if (this.data.selectedPoint === null) {
        // 只有在选择了自定义输入时才进行此校验
        // 将字符串转换为数字
        const numPoints = Number(finalPoints);

        // 检查是否为数字，且大于0，且是10的整数倍
        if (isNaN(numPoints) || numPoints <= 0 || numPoints % 10 !== 0) {
          wx.showToast({
            title: '自定义积分必须为10的整数倍',
            icon: 'none',
          });
          return;
        }
      }

      if (!userPhone || userPhone.length !== 11) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none',
        });
        return;
      }

      this.setData({ transferring: true });

      wx.cloud
        .callFunction({
          // 云函数名称
          name: 'updateuserinfo',
          // 传给云函数的参数
          data: {
            type: 'TRANSFER',
            credits: finalPoints,
            phoneNumber: this.data.userInfo.phoneNumber,
            receiverPhoneNumber: userPhone,
          },
        })
        .then((res) => {
          if (res.result.errCode === 0) {
            saveUserInfoLocally(res.result.userInfo);
            this.onSuccess();
          } else {
            this.onFail(res.result.errMsg);
          }
        });
    },

    onFail(errMessage) {
      this.setData({ transferring: false });
      Toast({
        context: this,
        selector: '#t-toast',
        theme: 'warning',
        message: errMessage,
        direction: 'column',
      });
    },

    onSuccess() {
      this.setData({ transferring: false });
      Toast({
        context: this,
        selector: '#t-toast',
        theme: 'success',
        message: '转赠成功!',
        direction: 'column',
      });
      this.closeTransferCreditsPopup();
    },

    onTransferCreditsPopupVisibleChange(e) {
      this.setData({
        transferCreditsPopupVisible: e.detail.visible,
      });
    },

    openTransferCreditsPopup() {
      this.setData({
        transferCreditsPopupVisible: true,
      });
    },

    closeTransferCreditsPopup() {
      this.setData({
        transferCreditsPopupVisible: false,
      });
    },

    transferCredits() {
      this.openTransferCreditsPopup();
    },
  },
});
