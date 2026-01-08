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
      const res = await wx.cloud.getTempFileURL({
        fileList: fileIDs.map((id) => ({ fileID: id })),
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
      this.setData({ pageLoading: false });
    }
  },

  toggleColorCard() {
    // deprecated: collapse removed, keep for backward compatibility (no-op)
    return;
  },

  // placeholder interactions
  onHeroLeftTap() {},
  onHeroRightTap() {},
  onCategoryTap() {},
  onBannerLeftTap() {},
  onBannerRightTap() {},
});
