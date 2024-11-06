// pages/showcase-detail/index.js
const db = wx.cloud.database();
const _ = db.command;
const { CLOUD_STROAGE_PATH } = getApp().globalData;
const fakeData = {
  coverImage: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/misc/cover.jpg',
  title: '建筑案例一',
  relatedProducts: [
    {
      imageUrl: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/misc/cover.jpg',
      title: '液态陶晶',
    },
    {
      imageUrl: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/misc/cover.jpg',
      title: '铜墙铁壁',
    },
    {
      imageUrl: 'cloud://digital-7gwdimnu0a14ab1b.6469-digital-7gwdimnu0a14ab1b-1330344628/resources/misc/cover.jpg',
      title: '外墙面釉',
    },
  ],
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ...fakeData,
    pageLoading: false,
    overlayVisible: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init(options.id);
    // TODO, After fetch data
    // this.setData({
    //   swiperList: this.data.relatedProducts.map((current) => {
    //     return current.imageUrl;
    //   }),
    // });
    // console.log(this.data.swiperList);
  },

  async init(showcaseId) {
    this.setData({ pageLoading: true });
    console.log(showcaseId);
    const { data } = await db
      .collection('showcase')
      .where({
        _id: _.eq(showcaseId),
      })
      .limit(1)
      .get();

    const relatedProducts = await db
      .collection('product')
      .where({
        _id: _.in(data[0].products),
      })
      .get();

    this.setData({
      coverImage: `${CLOUD_STROAGE_PATH}/showcase/${showcaseId}/cover.jpg`,
      title: data[0].title,
      description: data[0].description,
      descriptionText: data[0].descriptionText,
      imageUrl: data[0].images.map((item) => {
        return `${CLOUD_STROAGE_PATH}/showcase/${showcaseId}/${item}`;
      }),
      relatedProducts: relatedProducts.data.map((item) => {
        return {
          imageUrl: `${CLOUD_STROAGE_PATH}/product/${item._id}/cover.jpg`,
          title: item.title,
        };
      }),
    });
    this.setData({ pageLoading: false });
  },

  populOverlay() {
    // TODO, here should set the click image to active image.
    this.setData({ overlayVisible: true });
  },

  handleOverlayClick(e) {
    this.setData({
      overlayVisible: false,
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
  onShareAppMessage() {},
});
