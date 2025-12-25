// pages/showcase-detail/index.js
let db, _;
try {
  db = wx.cloud.database();
  _ = db.command;
} catch (e) {
  console.warn('云开发环境未初始化', e);
}

const { CLOUD_STROAGE_PATH } = getApp().globalData || { CLOUD_STROAGE_PATH: '' };
const fakeData = {
  coverImage: `${CLOUD_STROAGE_PATH}/image/showcase-detail/pic@2x(1).png`,
  heroImage: `${CLOUD_STROAGE_PATH}/image/showcase-detail/pic@2x(1).png`,
  title: '美联涂料案例–绿洲中环中心',
  projectAddress: '上海普陀',
  descriptionText: '【预设文案】京实商派角派养油直张形族九许究列完提动争起开花选色成比志很务比长为业取你最命量收是千六太。命任科写调按至织反响感传开严才运研参中即国问以律向立值可反将当备任主看场社动体约如部现与务分不听利入么研部色连属。',
  detailTextImage: `${CLOUD_STROAGE_PATH}/image/showcase-detail/pic@2x.png`,
  relatedProducts: [
    {
      imageUrl: `${CLOUD_STROAGE_PATH}/image/showcase-detail/pic1@2x.png`,
      title: 'M3001哑...',
      productId: 'M3001',
    },
    {
      imageUrl: `${CLOUD_STROAGE_PATH}/image/showcase-detail/pic1@2x.png`,
      title: 'M601拉...',
      productId: 'M601',
    },
    {
      imageUrl: `${CLOUD_STROAGE_PATH}/image/showcase-detail/pic1@2x.png`,
      title: '油性底漆',
      productId: 'oil-primer',
    },
    {
      imageUrl: `${CLOUD_STROAGE_PATH}/image/showcase-detail/pic1@2x.png`,
      title: '内墙漆',
      productId: 'interior-paint',
    },
  ],
  imageUrl: [
    `${CLOUD_STROAGE_PATH}/image/showcase-detail/pic@2x.png`,
    `${CLOUD_STROAGE_PATH}/image/showcase-detail/pic@2x(1).png`,
    `${CLOUD_STROAGE_PATH}/image/showcase-detail/pic@2x.png`,
    `${CLOUD_STROAGE_PATH}/image/showcase-detail/pic@2x(1).png`,
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
    navBackIcon: `${CLOUD_STROAGE_PATH}/image/common/back.png`,
    detailIcon: `${CLOUD_STROAGE_PATH}/image/showcase-detail/title@2x.png`,
    defaultProductIcon: `${CLOUD_STROAGE_PATH}/image/showcase-detail/pic1@2x.png`,
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
        ? (CLOUD_STROAGE_PATH ? `${CLOUD_STROAGE_PATH}/showcase/${showcaseId}/${data[0].showcaseImage}` : '')
        : (data[0].images && data[0].images.length > 0 && CLOUD_STROAGE_PATH 
          ? `${CLOUD_STROAGE_PATH}/showcase/${showcaseId}/${data[0].images[0]}` 
          : '');

    this.setData({
        coverImage: CLOUD_STROAGE_PATH ? `${CLOUD_STROAGE_PATH}/showcase/${showcaseId}/cover.jpg` : '',
        title: data[0].title || fakeData.title,
        projectAddress: data[0].address || data[0].projectAddress || fakeData.projectAddress,
      description: data[0].description,
        descriptionText: data[0].descriptionText || '这里是案例介绍的详细内容，展示了项目的具体信息和特点。',
        showcaseImage: showcaseImage,
        imageUrl: data[0].images && CLOUD_STROAGE_PATH ? data[0].images.map((item) => {
        return `${CLOUD_STROAGE_PATH}/showcase/${showcaseId}/${item}`;
        }) : [],
        imageUrlHiRes: data[0].images && CLOUD_STROAGE_PATH ? data[0].images.map((item) => {
        const index = item.lastIndexOf('.');
        const extension = item.substring(item.lastIndexOf('.'));
        return `${CLOUD_STROAGE_PATH}/showcase/${showcaseId}/${item.substring(0, index)}@2x${extension}`;
        }) : [],
        relatedProducts: relatedProducts.data && relatedProducts.data.length > 0 ? relatedProducts.data.map((item) => {
        return {
            imageUrl: CLOUD_STROAGE_PATH ? `${CLOUD_STROAGE_PATH}/product/${item._id}/cover.jpg` : '',
          title: item.title,
          productId: item._id,
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
    wx.navigateTo({
      url: `/pages/product-detail/index?productId=${e.currentTarget.dataset.productId}`,
    });
  },
  
  // 从使用产品列表直接跳转到产品详情
  navigateToProductDetailFromList(e) {
    const productId = e.currentTarget.dataset.productId;
    if (productId) {
      wx.navigateTo({
        url: `/pages/product-detail/index?productId=${productId}`,
      });
    } else {
      // 如果没有 productId，不执行任何操作
      console.warn('产品ID不存在，无法跳转到产品详情页');
    }
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
