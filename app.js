import updateManager from './common/updateManager';
import { fetchUserInfo } from './services/user/service';
import { eventBus } from './utils/eventBus';

App({
  globalData: {
    // #if MP
    CLOUD_STROAGE_PATH: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628',
    CLOUD_IMAGE_BASE: 'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la',
    // #elif IOS || ANDROID
    CLOUD_STROAGE_PATH: 'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la', // 多端模式不支持cloudId
    CLOUD_IMAGE_BASE: 'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la',

    // 图片URL处理函数 - 统一使用HTTPS URL确保兼容性
    getImageUrl: function(path) {
      return this.CLOUD_IMAGE_BASE + path;
    },
    // #endif
    userInfo: wx.getStorageSync('userInfo'),
    referrer: '',
  },

  eventBus: eventBus, // Make eventBus globally accessible
  onLaunch: function () {
    // #if MP
    try {
    wx.cloud.init({
      // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      env: wx.cloud.DYNAMIC_CURRENT_ENV,
      // 是否在将用户访问记录到用户管理中，在控制台中可见，默认为false
      traceUser: false,
    });
    } catch (error) {
      console.warn('云开发初始化失败，请检查云开发环境配置:', error);
      // 云开发环境不存在时，不影响小程序其他功能运行
    }
    // #elif IOS || ANDROID
    try {
    wx.cloud.init({
      appid: 'wx422e25222a1fd968', // 创建云开发环境的 AppID（小程序、公众号），不是多端应用 AppID
      envid: 'digital-7gwdimnu0a14ab1b', // 云开发环境名称
    });
    } catch (error) {
      console.warn('云开发初始化失败，请检查云开发环境配置:', error);
    }
    // #endif
  },
  onShow: function () {
    updateManager();
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.phoneNumber) {
      fetchUserInfo(userInfo.phoneNumber);
    }
  },
});
