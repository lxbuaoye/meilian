// pages/product-detail/index.js
const db = wx.cloud.database();
const _ = db.command;
const { CLOUD_STROAGE_PATH } = getApp().globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    instruction: {
      data: [],
    },
    currency: '¥',
    unit: '',
    containMultipleImages: false,
    imageList: [],
    imageListHiRes: [],
    displayPrice: '99999.00',
    unitText: '/(件)',
    detailName: '',
    detailCode: '',
    tags: [],
    heroImage: '/image/2.1.3 电子色卡·详情·案例详情·产品 1素材/pic@2x.png',
    statusBarHeight: 0,
    navBarHeight: 0,
    // 默认展示数据用于还原效果
    title: '微岩石',
    detailName: '铜墙铁壁双组份外墙漆',
    detailCode: 'DE801',
    tags: ['持久保色', '抗碱耐候', '防水防晒', '防霉防潮'],
    price: 99999,
    unit: '件',
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
    this.init(options.productId);
  },

  async init(productId) {
    console.log(productId);
    // 设置默认图片路径
    const defaultImage = '/image/2.1.3 电子色卡·详情·案例详情·产品 1素材/pic@2x.png';
    
    try {
      const { data } = await db
        .collection('product')
        .where({
          _id: _.eq(productId),
        })
        .limit(1)
        .get();
      const priceValue = Number((data[0] && data[0].price) || this.data.price || 0);
      const displayPrice = Number.isNaN(priceValue) ? '0.00' : priceValue.toFixed(2);

      const detailName = data[0]?.name || data[0]?.title || this.data.detailName;
      const detailCode = data[0]?.code || data[0]?.serial || data[0]?.sku || data[0]?._id || this.data.detailCode;
      const tags = data[0]?.tags?.length ? data[0].tags : this.data.tags;
      const title = data[0]?.title || this.data.title;
      const unit = data[0]?.unit || this.data.unit;

      const images = data[0]?.images || [];
      let imageList = [];
      let imageListHiRes = [];
      let heroImage = defaultImage;
      
      if (images.length > 0) {
        imageList = images.map((item) => `${CLOUD_STROAGE_PATH}/product/${productId}/${item}`);
        imageListHiRes = images.map((item) => {
            const index = item.lastIndexOf('.');
            const extension = item.substring(item.lastIndexOf('.'));
            return `${CLOUD_STROAGE_PATH}/product/${productId}/${item.substring(0, index)}@2x${extension}`;
        });
        heroImage = imageList[0];
      } else {
        imageList = [defaultImage];
        imageListHiRes = [defaultImage];
        heroImage = defaultImage;
      }

      this.setData({
        ...data[0],
        title,
        displayPrice,
        unit,
        unitText: unit ? `/(${unit})` : '',
        detailName,
        detailCode,
        tags,
        imageList,
        imageListHiRes,
        heroImage: heroImage,
        containMultipleImages: imageList.length > 1,
      });
    } catch (error) {
      console.error('加载产品详情失败:', error);
      // 使用默认数据
      this.setData({
        heroImage: defaultImage,
        imageList: [defaultImage],
        imageListHiRes: [defaultImage],
      });
    }
  },
  previewImage(e) {
    wx.previewImage({
      current: this.data.imageListHiRes[e.currentTarget.dataset.index],
      urls: this.data.imageListHiRes,
    });
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
  handleBuy() {
    wx.showToast({
      title: '已加入购买清单',
      icon: 'success',
    });
  },
  onImageError(e) {
    console.error('图片加载失败:', e.detail);
    console.error('图片路径:', this.data.heroImage);
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
      title: `数码彩产品 - ${this.data.title}`,
    };
  },
  onShareTimeline() {
    return {
      title: `数码彩产品 - ${this.data.title}`,
    };
  },
});
