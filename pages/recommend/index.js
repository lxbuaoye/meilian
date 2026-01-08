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
    incomingCategory: '',
    navTitle: '推荐',
    thumbByCategory: {},
    categories: [],
    itemsByCategory: {},
    activeIndex: 0,
    activeImageUrl: '',
    imageAreaHeight: 300
  },

  onLoad(options = {}) {
    // accept incoming category param (e.g., ?category=wq)
    const incoming = options && options.category ? decodeURIComponent(options.category) : '';
    if (incoming) {
      this.setData({ incomingCategory: incoming });
      // set nav title based on incoming
      if (incoming === 'wq') {
        this.setData({ navTitle: '外墙年度人气爆款' });
      } else if (incoming === 'nq') {
        this.setData({ navTitle: '内墙年度人气爆款' });
      }
    }
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
      // If incomingCategory was provided, filter by lb field:
      // 'wq' -> lb: '外墙', 'nq' -> lb: '内墙'
      let query = db.collection('Recommended');
      const incoming = this.data.incomingCategory;
      if (incoming === 'wq') {
        query = query.where({ lb: '外墙' });
      } else if (incoming === 'nq') {
        query = query.where({ lb: '内墙' });
      }
      const res = await query.get();
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

      this.setData({ categories, itemsByCategory }, async () => {
        // build thumbnails for each category using first item's tpdz if available
        const fileList = [];
        const catToFileId = {};
        categories.forEach((cat) => {
          const items = itemsByCategory[cat] || [];
          const first = items[0] || {};
          const tpdz = first.tpdz || first.path || '';
          if (tpdz && !tpdz.startsWith('http')) {
            fileList.push({ fileID: tpdz });
            catToFileId[tpdz] = cat;
          } else if (tpdz && tpdz.startsWith('http')) {
            // directly set http url
            this.setData({ [`thumbByCategory.${cat}`]: tpdz });
          }
        });

        if (fileList.length > 0 && wx.cloud && wx.cloud.getTempFileURL) {
          try {
            const res = await wx.cloud.getTempFileURL({ fileList });
            (res.fileList || []).forEach((f) => {
              const cat = catToFileId[f.fileID];
              if (cat) {
                this.setData({ [`thumbByCategory.${cat}`]: f.tempFileURL || '' });
              }
            });
          } catch (err) {
            console.warn('getTempFileURL for thumbnails failed', err);
          }
        }

        // determine initial active index -- prefer incomingCategory if provided
        let idx = 0;
        const incoming = this.data.incomingCategory;
        if (incoming && categories && categories.length > 0) {
          const found = categories.indexOf(incoming);
          if (found !== -1) idx = found;
        }
        if (categories.length > 0) {
          this.setActiveImageByIndex(idx);
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
    if (tpdz.startsWith('cloud://')) {
      wx.cloud.getTempFileURL({
        fileList: [{ fileID: tpdz }],
        success: (res) => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            this.setData({ activeIndex: index, activeImageUrl: res.fileList[0].tempFileURL });
          } else {
            console.warn('获取图片URL失败:', tpdz);
            this.setData({ activeIndex: index, activeImageUrl: '' });
          }
        },
        fail: (err) => {
          console.error('获取图片URL出错:', err);
          this.setData({ activeIndex: index, activeImageUrl: '' });
        }
      });
    } else {
      // 如果不是有效的 cloud:// 路径，直接设置为空
      console.warn('无效的图片路径格式:', tpdz);
      this.setData({ activeIndex: index, activeImageUrl: '' });
    }
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

