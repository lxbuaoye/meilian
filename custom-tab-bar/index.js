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
      
      // 如果是占位项，不跳转
      if (item.isPlaceholder) {
        return;
      }
      
      this.setData({ active: index });
      if (item.url) {
        wx.switchTab({
          url: item.url.startsWith('/')
            ? item.url
            : `/${item.url}`,
        });
      }
    },
    
    onSpecialButtonTap() {
      // 预约到店特殊按钮点击
      const item = this.data.list.find(i => i.isSpecial);
      if (item && item.url) {
        const index = this.data.list.indexOf(item);
        this.setData({ active: index });
      wx.switchTab({
          url: item.url.startsWith('/')
            ? item.url
            : `/${item.url}`,
        });
      }
    },
    
    onItemTap(e) {
      const index = e.currentTarget.dataset.index;
      const item = this.data.list[index];
      
      // 如果是占位项，不跳转
      if (item.isPlaceholder) {
        return;
      }
      
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
          if (item.isPlaceholder || !item.url) return false;
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
