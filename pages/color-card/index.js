// pages/color-card/index.js
const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;

Page({
  data: {
    menuBarTop: 44, // 胶囊按钮顶部位置
    menuBarHeight: 32, // 胶囊按钮高度
    navBackIcon: `${CLOUD_IMAGE_BASE}/image/common/back.png`,
    logoImage: `${CLOUD_IMAGE_BASE}/resources/logo1.png`,
    keyword: '',
    // 0: 乳胶漆, 1: 仿石漆, 2: 艺术漆
    activeTopTab: 1,
    activeChip: 0,
    chips: [], // 二级分类（根据选择的一级分类动态生成）
    // 所有色卡数据（从云 DB 加载）
    allCards: [],
    filteredCards: [],
    // 映射索引到一级分类名称（与数据库中的 category 字段匹配）
    topCategoryNames: ['乳胶漆', '仿石漆', '艺术漆'],
    // 占位图片（当 tpdz 为空时）
    placeholderImage: '/image/v2.1_color_card_assets/placeholder.png',
  },

  onLoad() {
    // 初始化导航栏信息，与首页保持一致
    const menuButton = wx.getMenuButtonBoundingClientRect();
    this.setData({
      menuBarTop: menuButton.top,
      menuBarHeight: menuButton.height,
    });

    // 从云数据库加载产品数据
    this.fetchProductsFromDB().catch(err => console.error('加载产品数据失败:', err));
  },

  /**
   * 生命周期函数--监听页面显示
   * 确保每次切换回该页面时都刷新自定义 TabBar 的 active 状态
   */
  onShow() {
    if (this.getTabBar && typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar();
      if (tabBar && typeof tabBar.init === 'function') {
        tabBar.init();
      }
    }
  },

  handleBack() {
    wx.navigateBack({ delta: 1 });
  },

  handleKeywordInput(e) {
    this.setData({ keyword: (e.detail && e.detail.value) || '' });
    this.applyFilter();
  },

  // 切换一级分类（索引）
  setTopTab(e) {
    const index = Number(e.currentTarget.dataset.index) || 0;
    this.setData({ activeTopTab: index, activeChip: 0 }, () => {
      this.buildChipsForActiveTopTab();
    });
  },

  // 切换二级分类芯片
  setChip(e) {
    const idx = Number(e.currentTarget.dataset.index) || 0;
    this.setData({ activeChip: idx }, () => {
      this.applyFilter();
    });
  },

  // 从云函数获取所有产品数据
  async fetchProductsFromDB() {
    if (!wx.cloud) {
      console.warn('wx.cloud 未初始化，无法调用云函数');
      return;
    }

    try {
      // #region agent log
      try {
        fetch('http://127.0.0.1:7242/ingest/4dfd47dc-5184-408a-80e6-ead7f5d01f49',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1',location:'pages/color-card/index.js:fetchProductsFromDB',message:'callFunction start',data:{},timestamp:Date.now()})}).catch(()=>{});
      } catch(e) {}
      // #endregion
      const result = await wx.cloud.callFunction({
        name: 'getallproducts'
      });

      if (result.result.success) {
        const allDocs = result.result.data;
        console.log(`总共读取到 ${allDocs.length} 条产品记录`);

        const mapped = allDocs.map((d) => {
          const originalImage = d.tpdz || this.data.placeholderImage;
          // 将原图路径转换为压缩图路径进行预览
          let compressedImage = originalImage;
          if (originalImage && originalImage.includes('/product/')) {
            compressedImage = originalImage.replace('/product/', '/compressed_color_cards/');
          }

          // #region agent log
          try {
            if ((d.cpmc && d.cpmc.includes('MH6401')) || (compressedImage && compressedImage.includes('MH6401'))) {
              fetch('http://127.0.0.1:7242/ingest/4dfd47dc-5184-408a-80e6-ead7f5d01f49',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2',location:'pages/color-card/index.js:map',message:'item mapped',data:{cpmc:d.cpmc,originalImage:originalImage,compressedImage:compressedImage},timestamp:Date.now()})}).catch(()=>{});
            }
          } catch(e) {}
          // #endregion

          // 提取展示名称：去掉前置编码（如 WJC-1492），只保留中文名称
          const rawName = d.cpmc || d.name || '';
          // 去除前导 ASCII 编码/编号，保留中文或剩余部分
          const displayName = (typeof rawName === 'string') ? rawName.replace(/^[\\x00-\\x7F-]+/, '').trim() : rawName;

          return {
            // 使用数据库字段映射到页面需要的字段
            categoryName: d.category || '', // 一级分类（字符串）
            subcategory: d.subcategory || '', // 二级分类（字符串）
            name: displayName || (d.cpmc || ''), // 产品名称（显示用）
            code: d.cpmc || '', // 使用名称作为 code，若有专用编码请替换
            img: compressedImage, // 预览时使用压缩图
            originalImg: originalImage, // 保存原图路径
            color: d.color || null, // 颜色字段，用于无图片时的色块显示，null表示无颜色
          };
        });

        // 乳胶漆色卡完全从数据库读取，不再使用默认硬编码数据
        const latexCards = mapped.filter(item => item.categoryName === '乳胶漆');
        if (latexCards.length > 0) {
          console.log(`从数据库加载到 ${latexCards.length} 个乳胶漆色卡`);
        } else {
          console.log('数据库中没有乳胶漆数据');
        }

        this.setData({ allCards: mapped }, () => {
          // #region agent log
          try {
            fetch('http://127.0.0.1:7242/ingest/4dfd47dc-5184-408a-80e6-ead7f5d01f49',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3',location:'pages/color-card/index.js:setData',message:'mapped set to state',data:{mappedLength:mapped.length},timestamp:Date.now()})}).catch(()=>{});
          } catch(e) {}
          // #endregion
          this.buildChipsForActiveTopTab();
        });
      } else {
        console.error('云函数返回错误：', result.result.error);
        this.setData({ allCards: [] }, () => {
          this.buildChipsForActiveTopTab();
        });
      }
    } catch (err) {
      console.error('调用云函数失败', err);
      // 失败时保留现有数据（如果需要可以设置默认）
      this.setData({ allCards: [] }, () => {
        this.buildChipsForActiveTopTab();
      });
    }
  },

  // 根据当前 activeTopTab 构建二级 chips（去重子类）
  buildChipsForActiveTopTab() {
    const { allCards, activeTopTab, topCategoryNames } = this.data;
    const topName = topCategoryNames[activeTopTab] || '';
    const subSet = new Set();
    allCards.forEach((item) => {
      if (item.categoryName === topName) {
        const key = item.subcategory || '其他';
        subSet.add(key);
      }
    });
    const chips = Array.from(subSet);
    // 如果没有子类则保留空数组（显示全部）
    this.setData({ chips: chips }, () => {
      // 如果当前 activeChip 超出范围，重置为 0
      const activeChip = this.data.activeChip >= chips.length ? 0 : this.data.activeChip;
      this.setData({ activeChip }, () => {
        this.applyFilter();
      });
    });
  },

  // 根据关键字、一级分类和二级分类筛选
  applyFilter() {
    const { keyword, activeTopTab, allCards, topCategoryNames, chips, activeChip } = this.data;
    const kw = (keyword || '').trim().toLowerCase();
    const topName = topCategoryNames[activeTopTab] || '';

    let filtered = allCards.filter((card) => {
      // 过滤一级分类
      if (topName && card.categoryName !== topName) return false;
      // 过滤二级分类（如果存在 chips 并且有选中的子类）
      if (chips && chips.length > 0) {
        const selectedSub = chips[activeChip] || '';
        if (selectedSub && card.subcategory !== selectedSub) return false;
      }
      return true;
    });

    // 关键字搜索（名称或编码）
    if (kw) {
      filtered = filtered.filter((card) => {
        const name = (card.name || '').toLowerCase();
        const code = (card.code || '').toLowerCase();
        return name.includes(kw) || code.includes(kw);
      });
    }

    this.setData({ filteredCards: filtered }, () => {
      // 如果数据库提供了颜色值，立即计算文字颜色以避免等待图片加载
      (filtered || []).forEach((card, idx) => {
        if (card && card.color) {
          try {
            this.computeTextColorForCard(card.code, card.img, idx, card.color);
          } catch (e) {
            // ignore
          }
        }
      });
    });
  },

  openDetail(e) {
    const name = e.currentTarget.dataset.name || '';
    const code = e.currentTarget.dataset.code || '';
    const img = e.currentTarget.dataset.img || '';
    const color = e.currentTarget.dataset.color || '';
    const params = `name=${encodeURIComponent(name)}&code=${encodeURIComponent(code)}&img=${encodeURIComponent(img)}&color=${encodeURIComponent(color)}`;
    wx.navigateTo({
      url: `/pages/color-detail/index?${params}`,
    });
  },

  // 图片加载时缓存到全局，避免切换选项卡或再次进入详情时重复加载
  onImageLoad(e) {
    try {
      const code = e.currentTarget.dataset.code || '';
      const img = e.currentTarget.dataset.img || '';
      const idx = e.currentTarget.dataset.idx;
      const app = getApp();
      if (!app.globalData) app.globalData = {};
      if (!app.globalData.colorCardImageCache) app.globalData.colorCardImageCache = {};
      if (code) {
        app.globalData.colorCardImageCache[code] = img;
      }
      // 在图片加载后尝试采样图片颜色以决定文字颜色（若数据库未提供 color 字段）
      try {
        this.computeTextColorForCard(code, img, idx);
      } catch (errCompute) {
        // 不影响主流程
        console.warn('computeTextColorForCard failed', errCompute);
      }
      // #region agent log
      try {
        fetch('http://127.0.0.1:7242/ingest/4dfd47dc-5184-408a-80e6-ead7f5d01f49',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H4',location:'pages/color-card/index.js:onImageLoad',message:'image load',data:{code:code,img:img},timestamp:Date.now()})}).catch(()=>{});
      } catch(e) {}
      // #endregion
    } catch (err) {
      console.warn('onImageLoad cache fail', err);
    }
  },

  /**
   * 判断颜色是否偏暗（输入可接受 hex 字符串或 rgb(...)）
   * 返回 true 表示深色（应使用白字），false 表示浅色（使用黑字）
   */
  isColorDark(colorStr) {
    if (!colorStr || typeof colorStr !== 'string') return false;
    let r = 255, g = 255, b = 255;
    const s = colorStr.trim().toLowerCase();
    // hex 格式
    if (s[0] === '#') {
      let hex = s.slice(1);
      if (hex.length === 3) {
        hex = hex.split('').map(ch => ch + ch).join('');
      }
      if (hex.length === 6) {
        r = parseInt(hex.slice(0,2), 16);
        g = parseInt(hex.slice(2,4), 16);
        b = parseInt(hex.slice(4,6), 16);
      }
    } else if (s.startsWith('rgb')) {
      // rgb(a) 格式： rgb(r,g,b) 或 rgba(...)
      const m = s.match(/rgba?\(([^)]+)\)/);
      if (m && m[1]) {
        const parts = m[1].split(',').map(p => Number(p.trim()));
        if (parts.length >= 3) {
          r = parts[0]; g = parts[1]; b = parts[2];
        }
      }
    }
    // 计算感知亮度：使用 Rec. 601 luma
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 128;
  },

  /**
   * 对单个色卡根据已有 color 或图片采样计算文字颜色并更新 filteredCards 中对应项的 textColor
   * code: 唯一 code 标识， img: 图片路径， idx: canvas id/index， color: 可选数据库颜色
   */
  computeTextColorForCard(code, img, idx, color) {
    const self = this;
    // 优先使用已有 color 字段判断
    if (color) {
      const dark = this.isColorDark(color);
      this._setTextColorForCard(code, dark ? '#FFFFFF' : '#000000');
      return;
    }

    if (!img || typeof idx === 'undefined' || idx === null) return;

    // 尝试获取图片信息并在对应 canvas 上绘制后采样 (10x10)
    try {
      wx.getImageInfo({
        src: img,
        success(res) {
          const canvasId = `canvas-${idx}`;
          const sampleSize = 10;
          const ctx = wx.createCanvasContext(canvasId, self);
          // drawImage 支持 res.path
          try {
            ctx.drawImage(res.path, 0, 0, sampleSize, sampleSize);
          } catch (errDraw) {
            // 某些平台可能需要兼容路径，这里忽略绘制错误
            console.warn('canvas drawImage failed', errDraw);
          }
          ctx.draw(false, () => {
            wx.canvasGetImageData({
              canvasId,
              x: 0,
              y: 0,
              width: sampleSize,
              height: sampleSize,
              success(getRes) {
                const data = getRes && getRes.data;
                if (!data || !data.length) {
                  return;
                }
                let rSum = 0, gSum = 0, bSum = 0, count = data.length / 4;
                for (let i = 0; i < data.length; i += 4) {
                  rSum += data[i];
                  gSum += data[i + 1];
                  bSum += data[i + 2];
                }
                const rAvg = rSum / count;
                const gAvg = gSum / count;
                const bAvg = bSum / count;
                const luminance = 0.299 * rAvg + 0.587 * gAvg + 0.114 * bAvg;
                const isDark = luminance < 128;
                self._setTextColorForCard(code, isDark ? '#FFFFFF' : '#000000');
              },
              fail(err) {
                // 不影响主流程
                console.warn('canvasGetImageData failed', err);
              }
            });
          });
        },
        fail(err) {
          console.warn('getImageInfo failed', err);
        }
      });
    } catch (errOuter) {
      console.warn('computeTextColorForCard error', errOuter);
    }
  },

  // 内部工具：批量更新 filteredCards 中匹配 code 的项的 textColor
  _setTextColorForCard(code, textColor) {
    if (!code) return;
    const updated = (this.data.filteredCards || []).map((it) => {
      if (it && it.code === code) {
        return Object.assign({}, it, { textColor });
      }
      return it;
    });
    this.setData({ filteredCards: updated });
  },

  // 图片加载失败回退处理：如果压缩图不可用，使用原图（originalImg）
  onImageError(e) {
    try {
      const code = e.currentTarget.dataset.code || '';
      const originalImg = e.currentTarget.dataset.original || '';
      if (!code || !originalImg) return;

      // 更新 filteredCards 中对应项的 img 字段（回退到原图）
      const updatedFiltered = (this.data.filteredCards || []).map((item) => {
        if (item.code === code) {
          return Object.assign({}, item, { img: originalImg });
        }
        return item;
      });

      // 同步更新 allCards，以免再次切换过滤导致仍然使用不可用的压缩图
      const updatedAll = (this.data.allCards || []).map((item) => {
        if (item.code === code) {
          return Object.assign({}, item, { img: originalImg, originalImg: originalImg });
        }
        return item;
      });

      this.setData({
        filteredCards: updatedFiltered,
        allCards: updatedAll,
      }, () => {
        // 将原图放入全局缓存，避免重复请求
        const app = getApp();
        if (!app.globalData) app.globalData = {};
        if (!app.globalData.colorCardImageCache) app.globalData.colorCardImageCache = {};
        app.globalData.colorCardImageCache[code] = originalImg;
      });
    } catch (err) {
      console.warn('onImageError handling failed', err);
    }
  },
});


