Page({
  data: {
    // Only keep loading state and logo/navbar info
    pageLoading: true,
    menuBarTop: 44,
    menuBarHeight: 32,
    logoImage: '/resources/logom.png',
    // images store for cloud temp URLs
    images: {
      heroLeft: '',
      heroRight: '',
      iconColorCard: '',
      bannerLeft: '',
      bannerRight: '',
    },
    categoryCards: [],
  },

  onLoad() {
    // init menu button position and logo from global config if available
    try {
      const menuButton = wx.getMenuButtonBoundingClientRect();
      this.setData({
        menuBarTop: menuButton.top,
        menuBarHeight: menuButton.height,
      });
    } catch (e) {}

    // 使用本地资源替换 logo
    this.setData({
      logoImage: '/resources/logom.png',
      pageLoading: true,
    });

    // start loading images from cloud storage
    this.loadCloudImages();
  },

  onShow() {
    if (this.getTabBar && typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar();
      if (tabBar && typeof tabBar.init === 'function') {
        tabBar.init();
      }
    }
    // retry shortly in case component attaches after onShow
    setTimeout(() => {
      try {
        if (this.getTabBar && typeof this.getTabBar === 'function') {
          const tabBar2 = this.getTabBar();
          if (tabBar2 && typeof tabBar2.init === 'function') tabBar2.init();
        }
      } catch (e) {}
    }, 120);
  },

  // allow external toggling if needed
  setLoading(isLoading) {
    this.setData({ pageLoading: !!isLoading });
  },

  async loadCloudImages() {
    const fileIDs = [
      'cloud://cloud1-9gz59mfw7610d03f.636c-cloud1-9gz59mfw7610d03f-1392076473/image/home/wq.png',
      'cloud://cloud1-9gz59mfw7610d03f.636c-cloud1-9gz59mfw7610d03f-1392076473/image/home/nq.png',
      'cloud://cloud1-9gz59mfw7610d03f.636c-cloud1-9gz59mfw7610d03f-1392076473/image/home/ysq anli.png',
      'cloud://cloud1-9gz59mfw7610d03f.636c-cloud1-9gz59mfw7610d03f-1392076473/image/home/se ka.png',
      'cloud://cloud1-9gz59mfw7610d03f.636c-cloud1-9gz59mfw7610d03f-1392076473/image/home/ai.png',
      'cloud://cloud1-9gz59mfw7610d03f.636c-cloud1-9gz59mfw7610d03f-1392076473/image/home/rqbkjt.png',
      'cloud://cloud1-9gz59mfw7610d03f.636c-cloud1-9gz59mfw7610d03f-1392076473/image/home/dzsk jt.png',
      'cloud://cloud1-9gz59mfw7610d03f.636c-cloud1-9gz59mfw7610d03f-1392076473/image/home/rjq anli.png',
      'cloud://cloud1-9gz59mfw7610d03f.636c-cloud1-9gz59mfw7610d03f-1392076473/image/home/fsq anli.png',
    ];

    try {
      // 过滤掉无效的 fileID
      const validFileIDs = fileIDs.filter(id => id && typeof id === 'string' && id.startsWith('cloud://'));

      if (validFileIDs.length === 0) {
        console.warn('没有有效的云文件ID');
        this.setData({ pageLoading: false });
        return;
      }

      const res = await wx.cloud.getTempFileURL({
        fileList: validFileIDs.map((id) => ({ fileID: id })),
      });
      const mapping = {};
      (res.fileList || []).forEach((f) => {
        mapping[f.fileID] = f.tempFileURL || '';
      });

      // assign images by matching fileIDs order (fallback if missing)
      this.setData({
        images: {
          heroLeft: mapping[fileIDs[0]] || '',
          heroRight: mapping[fileIDs[1]] || '',
          iconColorCard: mapping[fileIDs[3]] || '',
          rqbkjt:mapping[fileIDs[5]] || '',
          dzskjt:mapping[fileIDs[6]] || '',
          anli1:mapping[fileIDs[7]] || '',
          anli2:mapping[fileIDs[8]] || '',
          anli3:mapping[fileIDs[2]] || '',
          ai:mapping[fileIDs[4]] || '',
        },
        categoryCards: [
          { title: '乳胶漆案例', img: mapping[fileIDs[1]] || '' },
          { title: '仿石漆案例', img: mapping[fileIDs[2]] || '' },
          { title: '艺术漆案例', img: mapping[fileIDs[3]] || '' },
        ],
        pageLoading: false,
      });
    } catch (err) {
      console.error('loadCloudImages failed', err);
      // 即使失败也要设置 pageLoading 为 false
      this.setData({ pageLoading: false });
    }
  },

  toggleColorCard() {
    // deprecated: collapse removed, keep for backward compatibility (no-op)
    return;
  },

  // placeholder interactions
  onHeroLeftTap() {
    try {
      wx.navigateTo({ url: '/pages/recommend/index?category=wq' });
    } catch (e) {
      console.error('navigate to recommend (wq) failed', e);
    }
  },
  onHeroRightTap() {
    try {
      wx.navigateTo({ url: '/pages/recommend/index?category=nq' });
    } catch (e) {
      console.error('navigate to recommend (nq) failed', e);
    }
  },
  onCategoryTap() {},
  onBannerLeftTap() {},
  onBannerRightTap() {},
  navigateToColorChange() {
    try {
      wx.navigateTo({ url: '/pages/area-ai/color-change/index' });
    } catch (e) {
      console.error('navigate to color-change failed', e);
    }
  },
  navigateToColorCard() {
    try {
      // color-card is a tab page; use switchTab
      wx.switchTab({ url: '/pages/color-card/index' });
    } catch (e) {
      console.error('navigate to color-card failed', e);
    }
  },
  navigateToShowcase(e) {
    try {
      const cat = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.cat;
      if (!cat) return;
      if (cat === 'fsq') {
        // 仿石漆案例 -> open showcase-list page
        wx.navigateTo({ url: '/pages/showcase-list/index' });
        return;
      }
      wx.navigateTo({ url: `/pages/showcase/index?category=${encodeURIComponent(cat)}` });
    } catch (err) {
      console.error('navigateToShowcase failed', err);
    }
  },
});
