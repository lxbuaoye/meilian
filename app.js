import updateManager from './common/updateManager';

App({
  globalData: {
    CLOUD_STROAGE_PATH: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628',
  },
  onLaunch: function () {},
  onShow: function () {
    updateManager();
  },
});
