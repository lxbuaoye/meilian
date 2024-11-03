// pages/showcase-detail/index.js
const imageCdn = 'https://tdesign.gtimg.com/mobile/demos';
const fakeData = {
  coverImage: './index.jpg',
  title: '建筑案例一',
  relatedProducts: [
    {
      imageUrl: './index.jpg',
      title: '液态陶晶',
    },
    {
      imageUrl: './index.jpg',
      title: '铜墙铁壁',
    },
    {
      imageUrl: './index.jpg',
      title: '外墙面釉',
    },
    {
      imageUrl: './index.jpg',
      title: '外墙面釉',
    },
    {
      imageUrl: './index.jpg',
      title: '外墙面釉',
    },
    {
      imageUrl: './index.jpg',
      title: '外墙面釉',
    },
    {
      imageUrl: './index.jpg',
      title: '外墙面釉',
    },
    {
      imageUrl: './index.jpg',
      title: '外墙面釉',
    },
    {
      imageUrl: './index.jpg',
      title: '外墙面釉',
    },
    {
      imageUrl: './index.jpg',
      title: '外墙面釉',
    },
    {
      imageUrl: './index.jpg',
      title: '外墙面釉',
    },
    {
      imageUrl: './index.jpg',
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
    overlayVisible: false,
    swiperList: [
      `${imageCdn}/swiper1.png`,
      `${imageCdn}/swiper2.png`,
      `${imageCdn}/swiper1.png`,
      `${imageCdn}/swiper2.png`,
      `${imageCdn}/swiper1.png`,
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // TODO, After fetch data
    // this.setData({
    //   swiperList: this.data.relatedProducts.map((current) => {
    //     return current.imageUrl;
    //   }),
    // });
    // console.log(this.data.swiperList);
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
