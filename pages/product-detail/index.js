// pages/product-detail/index.js
const db = wx.cloud.database();
const _ = db.command;
const { CLOUD_STROAGE_PATH } = getApp().globalData;

const detailData = [
  {
    title: '产品名称',
    content: '铜墙双组份外墙',
  },
  {
    title: '产品编号',
    content: 'DE801',
  },
  {
    title: '产品简述',
    content:
      '针对目前外墙涂料普遍存在的易出现雨水渗透墙体，造成内外墙发黑发霉，墙面气泡、脱层， 翻新施工繁琐耗时的现状，数码彩推出革命性的防水抗碱外墙漆--铜墙铁壁系列。这是一款新 型专利外墙涂料，具有节能环保、施工简易、抗裂防水抗盐碱、造型多样以及卓越的附着力和 超长的耐候性。',
  },
  {
    title: '产品特点',
    content:
      '1. 优异的防水性:优于市面上最顶级的防水涂料\n 2. 杰出的耐盐碱性:优于市面上最顶级的抗碱底漆\n3. 抗开裂:轻松覆盖龟裂纹\n可以用布做样板\n4. 超长的耐候性:远超国家标准，耐人工气候老化性检测达 800h \n5. 卓越的附着力:双组份系列可以直接在瓷砖、马赛克、PVC 上施工。\n6. 可以免底漆免面漆，大大提高施工效率',
  },
];

const fakeData = {
  id: '1',
  title: '产品',
  currency: '¥',
  price: 9999,
  imageUrl: '',
  tags: [],
  description: '',
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    instruction: {
      data: [],
    },
    ...fakeData,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init(options.productId);
  },

  async init(productId) {
    console.log(productId);
    const { data } = await db
      .collection('product')
      .where({
        _id: _.eq(productId),
      })
      .limit(1)
      .get();
    this.setData({
      ...data[0],
      currency: '¥',
      imageUrl: `${CLOUD_STROAGE_PATH}/product/${productId}/cover.jpg`,
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
