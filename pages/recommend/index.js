// pages/recommend/index.js
const db = wx.cloud.database();

Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 0,
    tabsTop: 0,
    navBackIcon: '',
    logoImage: '',
    placeholderImage: '/image/v2.1_color_card_assets/placeholder.png',
    categories: [],
    itemsByCategory: {},
    activeIndex: 0,
    activeImageUrl: '',
    imageAreaHeight: 300
  },

  onLoad() {
    // 初始化自定义导航栏信息（与 color-detail 保持一致）
    const systemInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight || 0;
    const windowWidth = systemInfo.windowWidth || 375;
    const navContentHeightPx = (windowWidth * 100) / 750;
    const navBarHeight = statusBarHeight + navContentHeightPx + 20;
    const tabsTop = Math.max(navBarHeight - 20, statusBarHeight + navContentHeightPx);
    this.setData({
      statusBarHeight,
      navBarHeight,
      tabsTop,
    });

    // 从全局读取云路径基础常量（若存在）
    try {
      const app = getApp();
      const appGlobal = app && app.globalData ? app.globalData : {};
      const CLOUD_IMAGE_BASE = appGlobal.CLOUD_IMAGE_BASE || '';
      this.setData({
        navBackIcon: CLOUD_IMAGE_BASE ? `${CLOUD_IMAGE_BASE}/image/common/back.png` : '/image/common/back.png',
        logoImage: CLOUD_IMAGE_BASE ? `${CLOUD_IMAGE_BASE}/resources/logo1.png` : '/resources/logo1.png'
      });
    } catch (e) {}

    // 计算图片区域高度并加载数据（使用自定义导航栏）
    this.computeHeights();
    this.fetchRecommended();
  },

  computeHeights() {
    const that = this;
    wx.getSystemInfo({
      success(res) {
        const windowHeight = res.windowHeight;
        // approximate bottom tab bar height used in this project (custom tab bar)
        const bottomTabBarHeight = 50;
        // compute tabs height by querying selector
        const query = wx.createSelectorQuery();
        query.select('#tabs').boundingClientRect();
        query.exec((rects) => {
          let tabsHeight = 0;
          if (rects && rects[0] && rects[0].height) {
            tabsHeight = rects[0].height;
          } else {
            tabsHeight = 56;
          }
          const topBar = that.data.navBarHeight || 0;
          const imageAreaHeight = windowHeight - tabsHeight - bottomTabBarHeight - topBar;
          that.setData({ imageAreaHeight });
        });
      }
    });
  },

  async fetchRecommended() {
    try {
      const res = await db.collection('Recommended').get();
      const data = res.data || [];
      // build categories and mapping
      const categories = [];
      const itemsByCategory = {};
      data.forEach((item) => {
        const cat = item.category || '默认';
        if (!itemsByCategory[cat]) {
          itemsByCategory[cat] = [];
          categories.push(cat);
        }
        // tpdz is path in cloud storage; convert to temp URL later via cloud API
        itemsByCategory[cat].push(item);
      });

      this.setData({ categories, itemsByCategory }, () => {
        // set initial active image
        if (categories.length > 0) {
          this.setActiveImageByIndex(0);
        }
      });
    } catch (err) {
      console.error('fetchRecommended error', err);
    }
  },

  setActiveImageByIndex(index) {
    const cat = this.data.categories[index];
    const items = this.data.itemsByCategory[cat] || [];
    if (items.length === 0) {
      this.setData({ activeIndex: index, activeImageUrl: '' });
      return;
    }
    const first = items[0];
    // tpdz is expected to be cloud file ID or path (e.g., cloud://... or fileID)
    const tpdz = first.tpdz || first.path || '';
    if (!tpdz) {
      this.setData({ activeIndex: index, activeImageUrl: '' });
      return;
    }
    // 支持 http、cloud:// 或 fileID
    if (tpdz.startsWith('http')) {
      this.setData({ activeIndex: index, activeImageUrl: tpdz });
      return;
    }
    // 对 cloud:// 或 fileID 使用 getTempFileURL
    wx.cloud.getTempFileURL({
      fileList: [{ fileID: tpdz }],
      success: (res) => {
        if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
          this.setData({ activeIndex: index, activeImageUrl: res.fileList[0].tempFileURL });
        } else {
          this.setData({ activeIndex: index, activeImageUrl: '' });
        }
      },
      fail: () => {
        this.setData({ activeIndex: index, activeImageUrl: '' });
      }
    });
  },

  onTabTap(e) {
    const idx = Number(e.currentTarget.dataset.index);
    this.setActiveImageByIndex(idx);
  },

  handleBack() {
    wx.navigateBack({ delta: 1 });
  },

  onImageLoad() {
    // placeholder if needed
  }
});

