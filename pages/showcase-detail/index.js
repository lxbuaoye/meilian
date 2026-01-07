// pages/showcase-detail/index.js
let db, _;
try {
  db = wx.cloud.database();
  _ = db.command;
} catch (e) {
  console.warn('云开发环境未初始化', e);
}

const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;
const fakeData = {
  coverImage: `${CLOUD_IMAGE_BASE}/image/showcase-detail/pic@2x(1).png`,
  heroImage: `${CLOUD_IMAGE_BASE}/image/showcase-detail/pic@2x(1).png`,
  title: '美联涂料案例–绿洲中环中心',
  projectAddress: '上海普陀',
  descriptionText: '【预设文案】京实商派角派养油直张形族九许究列完提动争起开花选色成比志很务比长为业取你最命量收是千六太。命任科写调按至织反响感传开严才运研参中即国问以律向立值可反将当备任主看场社动体约如部现与务分不听利入么研部色连属。',
  detailTextImage: `${CLOUD_IMAGE_BASE}/image/showcase-detail/pic@2x.png`,
  relatedProducts: [
    {
      imageUrl: `${CLOUD_IMAGE_BASE}/image/showcase-detail/pic1@2x.png`,
      title: 'M3001哑...',
      productId: 'M3001',
    },
    {
      imageUrl: `${CLOUD_IMAGE_BASE}/image/showcase-detail/pic1@2x.png`,
      title: 'M601拉...',
      productId: 'M601',
    },
    {
      imageUrl: `${CLOUD_IMAGE_BASE}/image/showcase-detail/pic1@2x.png`,
      title: '油性底漆',
      productId: 'oil-primer',
    },
    {
      imageUrl: `${CLOUD_IMAGE_BASE}/image/showcase-detail/pic1@2x.png`,
      title: '内墙漆',
      productId: 'interior-paint',
    },
  ],
  imageUrl: [
    `${CLOUD_IMAGE_BASE}/image/showcase-detail/pic@2x.png`,
    `${CLOUD_IMAGE_BASE}/image/showcase-detail/pic@2x(1).png`,
    `${CLOUD_IMAGE_BASE}/image/showcase-detail/pic@2x.png`,
    `${CLOUD_IMAGE_BASE}/image/showcase-detail/pic@2x(1).png`,
  ],
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ...fakeData,
    swiperIndex: 0,
    pageLoading: false,
    overlayVisible: false,
    showcaseImage: '',
    heroImage: '',
    detailTextImage: '',
    statusBarHeight: 0,
    navBarHeight: 0,
    navBackIcon: `${CLOUD_IMAGE_BASE}/image/common/back.png`,
    detailIcon: `${CLOUD_IMAGE_BASE}/image/showcase-detail/title@2x.png`,
    defaultProductIcon: `${CLOUD_IMAGE_BASE}/image/showcase-detail/pic1@2x.png`,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取状态栏高度和导航栏总高度
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight || 0;
    // 导航内容高度 100rpx 转换为 px
    const navContentHeight = (100 / 750) * systemInfo.windowWidth;
    const navBarHeight = statusBarHeight + navContentHeight;
    this.setData({
      statusBarHeight: statusBarHeight,
      navBarHeight: navBarHeight,
    });
    this.init(options.id);
  },

  async init(showcaseId) {
    this.setData({ pageLoading: true });
    
    // 如果没有 showcaseId 或云开发环境不可用，使用本地默认数据和本地图片，避免云路径报错
    if (!showcaseId || !db) {
      this.setData({
        ...fakeData,
        imageUrlHiRes: fakeData.imageUrl,
      });
      this.setData({ pageLoading: false });
      return;
    }

    try {
    const { data } = await db
      .collection('showcase')
      .where({
        _id: _.eq(showcaseId),
      })
      .limit(1)
      .get();

      if (!data || data.length === 0) {
        throw new Error('未找到案例数据');
      }

      let relatedProducts = { data: [] };
      if (data[0].products && data[0].products.length > 0) {
        try {
          relatedProducts = await db
      .collection('product')
      .where({
        _id: _.in(data[0].products),
      })
      .get();
        } catch (e) {
          console.warn('获取关联产品失败', e);
        }
      }

      // 获取展示图片（优先使用 showcaseImage，否则使用第一张图片）
      const showcaseImage = data[0].showcaseImage 
        ? (CLOUD_IMAGE_BASE ? `${CLOUD_IMAGE_BASE}/showcase/${showcaseId}/${data[0].showcaseImage}` : '')
        : (data[0].images && data[0].images.length > 0 && CLOUD_IMAGE_BASE 
          ? `${CLOUD_IMAGE_BASE}/showcase/${showcaseId}/${data[0].images[0]}` 
          : '');

    this.setData({
        coverImage: CLOUD_IMAGE_BASE ? `${CLOUD_IMAGE_BASE}/showcase/${showcaseId}/cover.jpg` : '',
        title: data[0].title || fakeData.title,
        projectAddress: data[0].address || data[0].projectAddress || fakeData.projectAddress,
      description: data[0].description,
        descriptionText: data[0].descriptionText || '这里是案例介绍的详细内容，展示了项目的具体信息和特点。',
        showcaseImage: showcaseImage,
        imageUrl: data[0].images && CLOUD_IMAGE_BASE ? data[0].images.map((item) => {
        return `${CLOUD_IMAGE_BASE}/showcase/${showcaseId}/${item}`;
        }) : [],
        imageUrlHiRes: data[0].images && CLOUD_IMAGE_BASE ? data[0].images.map((item) => {
        const index = item.lastIndexOf('.');
        const extension = item.substring(item.lastIndexOf('.'));
        return `${CLOUD_IMAGE_BASE}/showcase/${showcaseId}/${item.substring(0, index)}@2x${extension}`;
        }) : [],
        relatedProducts: relatedProducts.data && relatedProducts.data.length > 0 ? relatedProducts.data.map((item) => {
        // 优先使用产品文档内的 cover 字段或 images[0]
        // 尝试使用 compressed_color_cards 缩略图路径（与 color-card 页面的处理保持一致）
        let imageUrl = '';
        try {
          if (CLOUD_IMAGE_BASE && item.cover) {
            // 先构造原图路径，再替换为压缩图路径
            const orig = `${CLOUD_IMAGE_BASE}/product/${item._id}/${item.cover}`;
            imageUrl = orig.includes('/product/') ? orig.replace('/product/', '/compressed_color_cards/') : orig;
          } else if (CLOUD_IMAGE_BASE && item.images && item.images.length > 0) {
            const orig = `${CLOUD_IMAGE_BASE}/product/${item._id}/${item.images[0]}`;
            imageUrl = orig.includes('/product/') ? orig.replace('/product/', '/compressed_color_cards/') : orig;
          } else {
            imageUrl = '';
          }
        } catch (e) {
          imageUrl = '';
        }
        // 如果没有有效 imageUrl，回退为页面默认的产品图（与 data 中的 defaultProductIcon 保持一致）
        const fallbackProductIcon = CLOUD_IMAGE_BASE ? `${CLOUD_IMAGE_BASE}/image/showcase-detail/pic1@2x.png` : '';
        return {
            imageUrl: imageUrl || fallbackProductIcon,
          title: item.title || item.cpmc || item.name || '',
          productId: item._id,
          code: item.cpmc || item.colorCode || '',
        };
        }) : fakeData.relatedProducts,
      });
    } catch (error) {
      console.error('加载案例详情失败', error);
      // 使用默认数据
      this.setData({
        ...fakeData,
        descriptionText: '这里是案例介绍的详细内容，展示了项目的具体信息和特点。',
        showcaseImage: '',
        imageUrl: [],
        imageUrlHiRes: [],
    });
    }
    
    this.setData({ pageLoading: false });
  },

  popupOverlay(e) {
    this.setData({ overlayVisible: true, swiperIndex: e.currentTarget.dataset.index });
  },

  previewImageList(e) {
    wx.previewImage({
      current: this.data.imageUrlHiRes[e.currentTarget.dataset.index],
      urls: this.data.imageUrlHiRes,
    });
  },
  onProductImageError(e) {
    try {
      const idx = e.currentTarget.dataset.index;
      const fallback = this.data.defaultProductIcon || (this.data.coverImage ? this.data.coverImage : '');
      if (typeof idx !== 'undefined' && this.data.relatedProducts && this.data.relatedProducts.length > idx) {
        const key = `relatedProducts[${idx}].imageUrl`;
        this.setData({
          [key]: fallback,
        });
        console.warn('onProductImageError: replaced relatedProducts image at index', idx, 'with fallback');
      } else {
        console.warn('onProductImageError: index out of range or relatedProducts missing', idx);
      }
    } catch (err) {
      console.error('onProductImageError error', err);
    }
  },
  previewShowcaseImage() {
    if (this.data.showcaseImage) {
      const allImages = [this.data.showcaseImage, ...this.data.imageUrl];
      wx.previewImage({
        current: this.data.showcaseImage,
        urls: allImages,
      });
    }
  },
  previewDetailTextImage() {
    if (this.data.detailTextImage) {
      wx.previewImage({
        current: this.data.detailTextImage,
        urls: [this.data.detailTextImage, ...this.data.imageUrl],
      });
    }
  },

  handleOverlayClick(e) {
    this.setData({
      overlayVisible: false,
    });
  },
  navigateToProductDetail(e) {
    const productId = e.currentTarget.dataset.productId;
    console.log('navigateToProductDetail -> productId:', productId, 'event:', e);
    if (!productId) {
      console.warn('navigateToProductDetail: missing productId, abort navigation');
      return;
    }
    wx.navigateTo({
      url: `/pages/product-detail/index?productId=${encodeURIComponent(productId)}`,
      success: () => {
        console.log('navigateToProductDetail: navigation success', productId);
      },
      fail: (err) => {
        console.error('navigateToProductDetail: navigation failed', err, productId);
      },
      complete: () => {
        console.log('navigateToProductDetail: navigation complete', productId);
      },
    });
  },
  
  // 从使用产品列表直接跳转到产品详情
  navigateToProductDetailFromList(e) {
    const index = e.currentTarget.dataset.index;
    console.log('navigateToProductDetailFromList -> index:', index, 'event:', e);
    // 点击产品后打开轮播图
    this.popupOverlay(e);
  },
  handleBack() {
    wx.navigateBack({
      delta: 1,
    });
  },
  handleMore() {
    wx.showActionSheet({
      itemList: ['分享', '复制链接'],
      success: (res) => {
        if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: this.data.shareUrl || '',
          });
        }
      },
    });
  },
  handleShare() {
    wx.showShareMenu({
      withShareTicket: true,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: `数码彩案例 - ${this.data.title}`,
    };
  },
  onShareTimeline() {
    return {
      title: `数码彩案例 - ${this.data.title}`,
    };
  },
});
