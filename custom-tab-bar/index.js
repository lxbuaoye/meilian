import TabMenu from './data';
Component({
  data: {
    active: 0,
    list: TabMenu,
    // #if MP
    size: 24,
    shape: 'normal',
    isMp: true,
    // #elif IOS || ANDROID
    size: '24rpx',
    shape: 'round',
    isMp: false,
    // #endif
  },

  methods: {
    onChange(event) {
      const accountInfo = wx.getAccountInfoSync();
      if (accountInfo.miniProgram.envVersion !== 'develop') {
        wx.vibrateShort({
          type: 'medium',
        });
      }
      this.setData({ active: event.detail.value });
      wx.switchTab({
        url: this.data.list[event.detail.value].url.startsWith('/')
          ? this.data.list[event.detail.value].url
          : `/${this.data.list[event.detail.value].url}`,
      });
    },

    init() {
      const page = getCurrentPages().pop();
      const route = page ? page.route.split('?')[0] : '';
      const active = this.data.list.findIndex(
        (item) => (item.url.startsWith('/') ? item.url.substr(1) : item.url) === `${route}`,
      );
      this.setData({ active });
    },
  },
});
