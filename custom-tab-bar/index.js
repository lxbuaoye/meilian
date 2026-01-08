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
      // Ensure index is number and valid
      const rawIndex = event && event.detail ? event.detail.value : undefined;
      const index = typeof rawIndex === 'string' ? Number(rawIndex) : rawIndex;
      if (typeof index !== 'number' || Number.isNaN(index) || index < 0 || index >= (this.data.list || []).length) {
        console.warn('custom-tab-bar.onChange: invalid index', rawIndex);
        return;
      }
      const item = this.data.list[index];

      if (item && item.url) {
        const target = item.url.startsWith('/') ? item.url : `/${item.url}`;
        console.log('custom-tab-bar.onChange: switching to', index, target);
        // Try switchTab first; only update active when switchTab succeeds.
        wx.switchTab({
          url: target,
          success: () => {
            this.setData({ active: index });
          },
          fail: (err) => {
            console.error('custom-tab-bar.onChange: switchTab failed', err, target);
            // fallback to navigateTo if switchTab fails for any reason
            try {
              wx.navigateTo({
                url: target,
                success: () => {
                  // Do not mark tab active because navigateTo may open a non-tab page.
                  // If target is actually a tab and navigateTo succeeded, we still avoid marking active here.
                },
              });
            } catch (e) {
              console.error('custom-tab-bar.onChange: navigateTo fallback failed', e, target);
            }
          },
        });
      } else {
        console.warn('custom-tab-bar.onChange: item has no url', item);
      }
    },

    init() {
      const page = getCurrentPages().pop();
      const route = page ? (page.route || '').split('?')[0] : '';
      // 规范化函数：去掉开头斜杠并去掉尾部的 index 文件名
      const normalize = (p = '') => {
        if (!p) return '';
        let s = p.startsWith('/') ? p.substr(1) : p;
        // remove trailing '/index' or ending 'index'
        s = s.replace(/\/index$/, '').replace(/index$/, '');
        return s;
      };

      const routeNorm = normalize(route);
      // 先尝试严格匹配，其次尝试包含或尾部匹配以提高容错性
      let active = -1;
      for (let i = 0; i < this.data.list.length; i++) {
        const item = this.data.list[i];
        if (!item || !item.url) continue;
        const itemUrlNorm = normalize(item.url);
        if (!itemUrlNorm) continue;
        if (itemUrlNorm === routeNorm) {
          active = i;
          break;
        }
      }
      if (active === -1) {
        for (let i = 0; i < this.data.list.length; i++) {
          const item = this.data.list[i];
          if (!item || !item.url) continue;
          const itemUrlNorm = normalize(item.url);
          if (!itemUrlNorm) continue;
          // route contains item url or vice versa
          if (routeNorm.includes(itemUrlNorm) || itemUrlNorm.includes(routeNorm)) {
            active = i;
            break;
          }
        }
      }
      if (active !== -1) {
        this.setData({ active });
      } else {
        // 如果未找到，保持当前 active 不变（避免占位项被选中）
        console.warn('custom-tab-bar.init: no matching tab for route', route, 'kept active', this.data.active);
      }
    },
  },
});
