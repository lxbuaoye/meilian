// pages/wuxing/index.js
import { getWuXingResult, getGeneratingWuXing } from './util';

let selectedDate = '1990-07-24 00:00:00';
const { CLOUD_STROAGE_PATH } = getApp().globalData;
const recommendationMap = new Map([
  [
    '金',
    {
      color: '白/银',
      samples: [
        {
          name: '天山白麻',
          caseNumber: 'DT-001',
          description: '白麻石，白色多，灰点，没有黑点，可参考荆洲瓷砖来样；调白',
          imageSrc: `${CLOUD_STROAGE_PATH}/resources/wuxing/DT-001-min.jpg`,
        },
        {
          name: '山东白麻',
          caseNumber: 'DT-002',
          description: '白麻石，白色多，灰点，没有黑点，可参考荆洲瓷砖来样；调白',
          imageSrc: `${CLOUD_STROAGE_PATH}/resources/wuxing/DT-002-min.jpg`,
        },
      ],
    },
  ],
  [
    '木',
    {
      color: '青/绿/翠',
      samples: [
        {
          name: '青山石',
          caseNumber: 'DT-003',
          description: 'DG-012 做DG-008大小的彩点',
          imageSrc: `${CLOUD_STROAGE_PATH}/resources/wuxing/DT-003-min.jpg`,
        },
        {
          name: '翠碧石',
          caseNumber: 'DT-004',
          description: 'DG-010 做DG-008大小的彩点',
          imageSrc: `${CLOUD_STROAGE_PATH}/resources/wuxing/DT-004-min.jpg`,
        },
      ],
    },
  ],
  [
    '水',
    {
      color: '灰/黑',
      samples: [
        {
          name: '芝麻灰',
          caseNumber: 'DT-005',
          description: 'DG-008',
          imageSrc: `${CLOUD_STROAGE_PATH}/resources/wuxing/DT-005-min.jpg`,
        },
        {
          name: '大地灰',
          caseNumber: 'DT-006',
          description: 'DG-018 做DG-008大小的彩点',
          imageSrc: `${CLOUD_STROAGE_PATH}/resources/wuxing/DT-006-min.jpg`,
        },
      ],
    },
  ],
  [
    '火',
    {
      color: '红',
      samples: [
        {
          name: '吉祥红',
          caseNumber: 'DT-007',
          description: 'DGJ-003',
          imageSrc: `${CLOUD_STROAGE_PATH}/resources/wuxing/DT-007-min.jpg`,
        },
        {
          name: '富贵红',
          caseNumber: 'DT-008',
          description: 'DGJ-005',
          imageSrc: `${CLOUD_STROAGE_PATH}/resources/wuxing/DT-008-min.jpg`,
        },
      ],
    },
  ],
  [
    '土',
    {
      color: '黄/棕',
      samples: [
        {
          name: '黄金麻',
          caseNumber: 'DT-009',
          description: 'DG-004 做DG-008大小的彩点',
          imageSrc: `${CLOUD_STROAGE_PATH}/resources/wuxing/DT-009-min.jpg`,
        },
        {
          name: '英国棕',
          caseNumber: 'DT-008',
          description: 'DF-4490 （海南特调）',
          imageSrc: `${CLOUD_STROAGE_PATH}/resources/wuxing/DT-010-min.jpg`,
        },
      ],
    },
  ],
]);

Page({
  /**
   * 页面的初始数据
   */
  data: {
    robotSrc: `${CLOUD_STROAGE_PATH}/resources/wuxing/robot.png`,
    isLoading: false,
    showResult: false, //TODO change this
    currentIndex: 0,
    direction: [
      {
        label: '东',
        value: 'east',
      },
      {
        label: '南',
        value: 'south',
      },
      {
        label: '西',
        value: 'west',
      },
      {
        label: '北',
        value: 'north',
      },
      {
        label: '东南',
        value: 'northeast',
      },
      {
        label: '东北',
        value: 'southeast',
      },
      {
        label: '西南',
        value: 'southwest',
      },
      {
        label: '西北',
        value: 'northwest',
      },
    ],
    gender: [
      {
        label: '男',
        value: 'man',
      },
      {
        label: '女',
        value: 'woman',
      },
    ],
    defaultDate: '1990-07-24 00:00:00',
    date: '1990-07-24 00:00:00',
    startDate: '1920-01-01 00:00:00',
    endDate: new Date().getTime(),
    wuxing: '土',
    recommendationText: 'The result will appear here...',
    recommendation: recommendationMap.get('土'),
  },
  onDateChange(e) {
    const { value } = e.detail;
    selectedDate = value;
  },

  previous() {
    this.setData({ currentIndex: this.data.currentIndex - 1 });
  },

  next() {
    console.log(selectedDate);
    this.setData({ currentIndex: this.data.currentIndex + 1 });
  },

  submit() {
    const wuxing = getWuXingResult(selectedDate);
    const generatingWuxing = getGeneratingWuXing(wuxing);
    console.log(wuxing);
    this.setData({
      result: wuxing,
      recommendation: recommendationMap.get(generatingWuxing),
      recommendationText: `从你的命盘来看，主要的五行属性是「 ${wuxing} 」。所以「 ${generatingWuxing} 」元素对你的整体运势有所助益。据此，我们为你整理了以下推荐：`,
    });
    this.setData({ showResult: true, isLoading: true });
    setTimeout(() => {
      this.setData({ isLoading: false });
    }, 1500);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(this.data.recommendation);
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
