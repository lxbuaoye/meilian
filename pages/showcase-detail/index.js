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
  coverImage: '',
  title: '美联涂料案例—绿洲中环中心',
  projectAddress: '上海普陀',
  relatedProducts: [
    {
      imageUrl: '',
      title: 'M3001哑...',
    },
    {
      imageUrl: '',
      title: 'M601拉...',
    },
    {
      imageUrl: '',
      title: '油性底漆',
    },
    {
      imageUrl: '',
      title: '内墙漆',
    },
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
    statusBarHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 0,
    });
    this.init(options.id);
  },

  async init(showcaseId) {
    this.setData({ pageLoading: true });
    
    // 如果没有 showcaseId 或云开发环境不可用，使用本地默认数据和本地图片，避免云路径报错
    if (!showcaseId || !db) {
      this.setData({
        ...fakeData,
        descriptionText: '这里是案例介绍的详细内容，展示了项目的具体信息和特点。',
        // 使用本地静态图片作为案例展示图，避免 cloud:// 路径在本地环境报错
        showcaseImage: '/image/2.1.2 电子色卡·详情·案例详情.png',
        imageUrl: [],
        imageUrlHiRes: [],
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
      // 如果没有 productId，可以打开 overlay 显示详情
      this.popupOverlay(e);
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
