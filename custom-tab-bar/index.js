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
      const index = event.detail.value;
      const item = this.data.list[index];

      this.setData({ active: index });
      if (item.url) {
        wx.switchTab({
          url: item.url.startsWith('/')
            ? item.url
            : `/${item.url}`,
        });
      }
    },

    init() {
      const page = getCurrentPages().pop();
      const route = page ? page.route.split('?')[0] : '';
      const active = this.data.list.findIndex(
        (item) => {
          if (!item.url) return false;
          const itemUrl = item.url.startsWith('/') ? item.url.substr(1) : item.url;
          return itemUrl === `${route}`;
        }
      );
      // 如果找到匹配项，设置为 active；否则保持当前 active（避免占位项被选中）
      if (active !== -1) {
      this.setData({ active });
      }
    },
  },
});
