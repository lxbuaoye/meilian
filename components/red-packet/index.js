// components/red-packet/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;

import { createPageWebSocketService } from '../../services/socket/util'; // 导入模块
import { fetchRedPacket } from '../../services/redpacket/util';
import Toast from 'tdesign-miniprogram/toast/index';
// components/userHeader/index.js
import { getLocalUserInfo } from '../../services/user/service';

Component({
  _webSocketService: null,

  /**
   * 组件的属性列表
   */
  properties: {},

  lifetimes: {
    attached() {
      const userInfo = getLocalUserInfo();
      if (userInfo && userInfo.phoneNumber) {
        this.setData({ userInfo });
      }

      this._webSocketService = createPageWebSocketService();

      // 2. 注册当前页面专属的 WebSocket 事件监听器
      this._webSocketService.onMessage(this.handleWebSocketMessage.bind(this));
      this._webSocketService.onError(this.handleWebSocketError.bind(this));

      // 3. 连接 WebSocket
      console.log('页面 onLoad: 尝试连接 WebSocket...');
      this._webSocketService.connect();
    },
    detached() {
      console.log('页面 onUnload: 关闭 WebSocket 连接并移除监听器。');

      // 1. 移除所有当前页面的 WebSocket 事件监听器
      this._webSocketService.offMessage(this.handleWebSocketMessage);
      this._webSocketService.offError(this.handleWebSocketError);

      // 2. 关闭 WebSocket 连接
      this._webSocketService.close();

      this._webSocketService = null; // 清除实例
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    redPacketInfo: {},
    showRedPacketButton: false,
    showRedPackettOverlay: false,
    isRedPacketOpened: false,
    endCountdown: '',
    redPacketFabSrc: `${CLOUD_STROAGE_PATH}/resources/ai/red_packet_fab.png`,
    redPacketOpenedSrc: `${CLOUD_STROAGE_PATH}/resources/ai/red_packet_opened.png`,
    redPacketCloseSrc: `${CLOUD_STROAGE_PATH}/resources/ai/red_packet_close.png`,
    fetchingRedPacket: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getCountdownMMSS(endTime) {
      const end = new Date(endTime);
      const now = new Date(); // 获取当前时间

      const difference = end.getTime() - now.getTime(); // 毫秒差

      // 如果时间差小于等于0，表示倒计时已结束
      if (difference <= 0) {
        this.setData({ showRedPacketButton: false });
        this.checkRedPacket();
        return '00:00';
      }

      // 将毫秒差转换为总秒数
      const totalSeconds = Math.floor(difference / 1000);

      // 辅助函数：将数字格式化为两位数，不足两位前面补零
      const padZero = (num) => num.toString().padStart(2, '0');

      // 计算分钟数和秒数
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      // 组合成 "MM:SS" 格式
      return `${padZero(minutes)}:${padZero(seconds)}`;
    },
    openRedPacket() {
      this.setData({ fetchingRedPacket: true });
      wx.cloud
        .callFunction({
          // 云函数名称
          name: 'fetchredpacket',
          // 传给云函数的参数
          data: {
            phoneNumber: this.data.userInfo.phoneNumber,
            campaignId: this.data.redPacketInfo._id,
          },
        })
        .then((res) => {
          console.log(res.result);
          if (res.result.success) {
            this.setData({ isRedPacketOpened: true, redPacketInfo: res.result.redPacket });
          } else {
            this.setData({ fetchingRedPacket: false });
            Toast({
              context: this,
              selector: '#t-toast',
              message: `${res.result.message}`,
              direction: 'column',
            });
          }
        })
        .catch((e) => {
          this.setData({ fetchingRedPacket: false });
          console.log(e);
        });
    },

    handleRedPacketFabClick() {
      if (!this.data.userInfo || !this.data.userInfo.phoneNumber) {
        // TODO, return error message
        return;
      }
      this.setData({ showRedPacketOverlay: true });
    },

    closeRedPacketOverlay() {
      this.setData({ showRedPacketOverlay: false });
      // Refresh to see if we need to suppress the fab icon.
      this.checkRedPacket();
    },

    checkRedPacket() {
      fetchRedPacket().then((res) => {
        if (!res) {
          this.setData({ showRedPacketButton: false });
          return;
        }
        this.setData({ showRedPacketButton: true, redPacketInfo: res });
        setInterval(() => {
          this.setData({ endCountdown: this.getCountdownMMSS(res.endTime) });
        }, 1000);
        console.log(res);
      });
    },

    handleWebSocketMessage(data) {
      try {
        const json = JSON.parse(data);
        console.log(json);
        if (json && json.type === 'CHECK_RED_PACKET') {
          this.checkRedPacket();
        }
      } catch (e) {
        console.log(e);
      }
    },

    handleWebSocketError(res) {
      console.error('页面收到 WebSocket 错误通知:', res);
    },
  },
});
