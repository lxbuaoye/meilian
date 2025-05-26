import updateManager from './common/updateManager';
import { fetchUserInfo } from './services/user/service';

App({
  globalData: {
    // #if MP
    CLOUD_STROAGE_PATH: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628',
    // #elif IOS || ANDROID
    CLOUD_STROAGE_PATH: 'https://6469-digital-7gwdimnu0a14ab1b-1330344628.tcb.qcloud.la', // 多端模式不支持cloudId
    // #endif
    userInfo: wx.getStorageSync('userInfo'),
  },
  onLaunch: function () {
    // #if MP

    wx.cloud.init({
      // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      env: 'digital-7gwdimnu0a14ab1b',
      // 是否在将用户访问记录到用户管理中，在控制台中可见，默认为false
      traceUser: false,
    });
    // #elif IOS || ANDROID
    wx.cloud.init({
      appid: 'wx422e25222a1fd968', // 创建云开发环境的 AppID（小程序、公众号），不是多端应用 AppID
      envid: 'digital-7gwdimnu0a14ab1b', // 云开发环境名称
    });
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
