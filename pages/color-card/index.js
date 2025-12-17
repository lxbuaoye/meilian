// pages/color-card/index.js
Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 0, // 导航栏总高度（状态栏 + 导航内容）
    keyword: '',
    activeTopTab: 1, // 默认仿石漆 (0: 乳胶漆, 1: 仿石漆, 2: 艺术漆)
    activeChip: 0,
    chips: ['峨坤石', '峨御石', '峨恒石', '峨玑石', '峨锦石'],
    // 所有色卡数据，包含分类信息
    allCards: [
      // 仿石漆分类的色卡
      { code: 'MK8401', name: 'MK8401加仕红', img: '/image/2.1 电子色卡·电子色卡素材/MK8401加仕红@2x.png', category: 1 },
      { code: 'MK8402', name: 'MK8402灰麻石', img: '/image/2.1 电子色卡·电子色卡素材/MK8402灰麻石@2x.png', category: 1 },
      { code: 'MK8403', name: 'MK8403黄锈石', img: '/image/2.1 电子色卡·电子色卡素材/MK8403黄锈石@2x.png', category: 1 },
      { code: 'MK8404', name: 'MK8404水晶白麻', img: '/image/2.1 电子色卡·电子色卡素材/MK8404水晶白麻@2x.png', category: 1 },
      { code: 'MK8405', name: 'MK8405金麻石', img: '/image/2.1 电子色卡·电子色卡素材/MK8405金麻石@2x.png', category: 1 },
      { code: 'MK8406', name: 'MK8406非洲虾红', img: '/image/2.1 电子色卡·电子色卡素材/MK8406非洲虾红@2x.png', category: 1 },
      { code: 'MK8407', name: 'MK8407海棠红', img: '/image/2.1 电子色卡·电子色卡素材/MK8407海棠红@2x.png', category: 1 },
      { code: 'MK8408', name: 'MK8408沙特砖红', img: '/image/2.1 电子色卡·电子色卡素材/MK8408沙特砖红@2x.png', category: 1 },
      // 可以在这里添加其他分类的色卡数据
      // { code: 'XX0001', name: 'XX0001示例', img: '/path/to/image.png', category: 0 }, // 乳胶漆
      // { code: 'XX0002', name: 'XX0002示例', img: '/path/to/image.png', category: 2 }, // 艺术漆
    ],
    filteredCards: [],
  },

  onLoad() {
    const systemInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight || 0;
    const windowWidth = systemInfo.windowWidth || 375; // 默认 iPhone 6/7/8 宽度
    // 导航栏总高度 = 状态栏高度(px) + 导航内容高度(100rpx 转 px)
    // 100rpx = windowWidth * 100 / 750
    const navContentHeightPx = (windowWidth * 100) / 750;
    const navBarHeight = statusBarHeight + navContentHeightPx + 20; // 额外 20px 间距确保不重叠
    this.setData({
      statusBarHeight: statusBarHeight,
      navBarHeight: navBarHeight,
    });
    this.applyFilter();
  },

  handleBack() {
    wx.navigateBack({ delta: 1 });
  },

  handleKeywordInput(e) {
    this.setData({ keyword: (e.detail && e.detail.value) || '' });
    this.applyFilter();
  },

  setTopTab(e) {
    const index = Number(e.currentTarget.dataset.index) || 0;
    this.setData({ activeTopTab: index });
    this.applyFilter();
  },

  setChip(e) {
    this.setData({ activeChip: Number(e.currentTarget.dataset.index) || 0 });
    this.applyFilter();
  },

  applyFilter() {
    const { keyword, activeTopTab, allCards } = this.data;
    const kw = (keyword || '').trim().toLowerCase();
    
    // 先根据分类筛选
    let filtered = allCards.filter((card) => {
      // 如果卡片没有 category 字段，默认显示在仿石漆分类
      const cardCategory = card.category !== undefined ? card.category : 1;
      return cardCategory === activeTopTab;
    });
    
    // 再根据关键词筛选（搜索编码和名称）
    if (kw) {
      filtered = filtered.filter((card) => {
        const name = (card.name || '').toLowerCase();
        const code = (card.code || '').toLowerCase();
        return name.includes(kw) || code.includes(kw);
      });
    }
    
    this.setData({ filteredCards: filtered });
  },

  openDetail(e) {
    const name = e.currentTarget.dataset.name || '';
    wx.navigateTo({
      url: `/pages/color-detail/index?name=${encodeURIComponent(name)}`,
    });
  },
});


