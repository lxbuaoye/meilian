// pages/ai/index.js
import { processImage } from './ImageUtil';
import Message from 'tdesign-miniprogram/message/index';

import * as echarts from './ec-canvas/echarts';

let chart = null;

const MAX_NUMBER = 6;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  });
  canvas.setChart(chart);
  chart.setOption({});
  return chart;
}

const { CLOUD_STROAGE_PATH } = getApp().globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    confirmBtn: { content: '确定', variant: 'outline' },
    imageSrc: '',
    passwordInput: !wx.getStorageSync('colorDetectorUnlocked'),
    inputValue: '',
    paintsOptionsActive: false,
    visible: false,
    colorResult: [],
    generatedImageSrc: '',
    src: '',
    ec: {
      onInit: initChart,
    },
  },
  onShow() {
    this.setData({
      passwordInput: !wx.getStorageSync('colorDetectorUnlocked'),
    });
  },
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      percentage: 0,
      mediaType: ['image'],
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success: (res) => {
        console.log(res);
        this.setData({ imageSrc: res.tempFiles[0].tempFilePath });
        wx.getImageInfo({
          src: res.tempFiles[0].tempFilePath,
          success: async (imgInfo) => {
            const { totalPixelCount, detail } = await processImage(imgInfo);
            console.log(detail);
            // Sum the top 5 colors to get the Others percentage
            this.setData({ colorResult: detail });

            const option = {
              backgroundColor: '#ffffff',
              series: [
                {
                  label: {
                    normal: {
                      fontSize: 16,
                      formatter: '{b}',
                    },
                  },
                  color: detail
                    .slice(0, MAX_NUMBER)
                    .map((item) => {
                      return item.hex;
                    })
                    .concat(['rgba(213,213,213,0.4)']),
                  type: 'pie',
                  center: ['50%', '40%'],
                  radius: ['10%', '60%'],
                  data: detail
                    .slice(0, MAX_NUMBER)
                    .map((item) => {
                      return {
                        value: item.percentage,
                        name: item.colorGroupName,
                      };
                    })
                    .concat([
                      {
                        value:
                          100 -
                          detail
                            .slice(0, MAX_NUMBER)
                            .reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.percentage), 0),
                        name: '其他',
                      },
                    ]),
                },
              ],
            };

            chart.setOption(option);
            // chart.on('click', function (params) {
            //   if (params.componentType === 'series') {
            //     const clickedDataIndex = params.dataIndex;

            //     // Update the chart options to change the label text
            //     chart.setOption({
            //       series: [
            //         {
            //           data: option.series[params.seriesIndex].data.map((item, index) => {
            //             if (index === clickedDataIndex) {
            //               return {
            //                 ...item,
            //                 label: {
            //                   show: true,
            //                   formatter: '{b}\n{c}%',
            //                 },
            //               };
            //             }
            //             if (item.label && item.label.formatter !== '{b}') {
            //               // Optional: Reset other labels to the default if they were changed
            //               return {
            //                 ...item,
            //                 label: {
            //                   show: true,
            //                   formatter: '{b}',
            //                 },
            //               };
            //             }
            //             return item;
            //           }),
            //         },
            //       ],
            //     });
            //   }
            // });
          },
        });
      },
    });
  },

  openViewer() {
    console.log('Trying to open viewer');
    if (this.data.imageSrc) {
      wx.navigateTo({
        url: `viewer/index?imageSrc=${this.data.imageSrc}`,
        success: (res) => {
          console.log(res);
        },
        fail: (res) => {
          console.log('~~');
          console.log(res);
        },
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const menuButton = wx.getMenuButtonBoundingClientRect();
    this.setData({
      menuBarTop: menuButton.top,
      menuBarHeight: menuButton.height,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

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

  onInputChange(event) {
    const { value } = event.detail;
    console.log('输入框的值：', value);

    // 更新 data 中的 inputValue，实现双向绑定
    this.setData({
      inputValue: value,
    });

    // 你可以在这里进行其他逻辑处理，例如校验输入等
  },

  confirmDialog(e) {
    if (this.data.inputValue === '3377') {
      this.setData({
        passwordInput: false,
      });
      // Save to storage
      wx.setStorageSync('colorDetectorUnlocked', true);
    } else {
      this.showTextMessage();
    }
  },

  closeDialog() {
    wx.navigateBack({
      detail: 1,
    });
  },

  showTextMessage() {
    Message.info({
      context: this,
      offset: [90, 32],
      duration: 5000,
      icon: false,
      // single: false, // 打开注释体验多个消息叠加效果
      content: '无效的邀请码',
    });
  },
});
