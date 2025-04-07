// pages/ai/index.js
import { processImage } from './ImageUtil';
import * as echarts from './ec-canvas/echarts';

let chart = null;

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
    imageSrc: '',
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
    this.getTabBar().init();
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
                    .slice(0, 5)
                    .map((item) => {
                      return item.hex;
                    })
                    .concat(['rgba(213,213,213,0.4)']),
                  type: 'pie',
                  center: ['50%', '40%'],
                  radius: ['10%', '60%'],
                  data: detail
                    .slice(0, 5)
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
                            .slice(0, 5)
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

  onChange1(e) {
    console.log(e.detail.value);
    this.setData({ value1: e.detail.value });
    if (e.detail.value === 2) {
      this.setData({ paintsOptionsActive: true });
    } else {
      this.setData({ paintsOptionsActive: false });
    }
  },
  onChange2(e) {
    this.setData({ value2: e.detail.value });
  },
  takePhoto() {
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath,
        });
      },
    });
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
  previewImage() {
    wx.previewImage({
      current: this.data.generatedImageSrc, // 当前显示图片的http链接
      urls: [], // 需要预览的图片http链接列表
    });
  },
  handleOverlayClick() {
    //  this.setData({ visible: false }); // TODO, remove this
    this.setData({ visible: false, generatedImageSrc: null });
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
