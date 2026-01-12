const db = wx.cloud.database();
const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_IMAGE_BASE } = appGlobal$;

Page({
  data: {
    pageTitle: '案例',
    statusBarHeight: 0,
    navBarHeight: 0,
    navBackIcon: `${CLOUD_IMAGE_BASE}/image/common/back@2x.png`,
    items: [],
  },

  onLoad(options = {}) {
    // determine title by incoming category param
    const cat = options && options.category ? decodeURIComponent(options.category) : '';
    if (cat === 'rjq') {
      this.setData({ pageTitle: '乳胶漆案例' });
      this.loadByCategory('乳胶漆案例');
    } else if (cat === 'ysq') {
      this.setData({ pageTitle: '艺术漆案例' });
      this.loadByCategory('艺术漆案例');
    } else {
      this.setData({ pageTitle: '案例' });
      this.loadByCategory(); // load all or default
    }

    // nav heights
    try {
      const menuButton = wx.getMenuButtonBoundingClientRect();
      const systemInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight || 0,
        navBarHeight: menuButton.height || 100,
      });
    } catch (e) {}
  },

  async loadByCategory(categoryName) {
    try {
      let query = db.collection('showcase');
      if (categoryName) {
        query = query.where({ category: categoryName });
      }
      const res = await query.orderBy('index', 'asc').get();
      const items = (res && res.data || []).map((d) => ({
        ...d,
        coverImageUrl: `${CLOUD_IMAGE_BASE}/showcase/${d._id}/cover.jpg`,
      }));
      this.setData({ items });
    } catch (err) {
      console.error('loadByCategory failed', err);
      this.setData({ items: [] });
    }
  },

  onBack() {
    try {
      const pages = getCurrentPages();
      // If there is a previous page in the stack, go back
      if (pages && pages.length > 1) {
        wx.navigateBack({ delta: 1 });
        return;
      }
      // otherwise try switchTab to home
      try {
        wx.switchTab({ url: '/pages/home/home' });
        return;
      } catch (err) {
        console.warn('switchTab to home failed', err);
      }
      // fallback to reLaunch to home
      try {
        wx.reLaunch({ url: '/pages/home/home' });
        return;
      } catch (err2) {
        console.error('reLaunch to home failed', err2);
      }
      wx.showToast({ title: '无法返回，请手动切换页面', icon: 'none' });
    } catch (e) {
      console.error('onBack unexpected error', e);
      wx.showToast({ title: '返回失败', icon: 'none' });
    }
  },

  onShowcaseClick(e) {
    const id = e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({ url: `/pages/showcase-detail/index?id=${id}` });
  },
});





