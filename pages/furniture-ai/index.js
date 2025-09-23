// pages/ai/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;
import Message from 'tdesign-miniprogram/message/index';
import { Toast } from 'tdesign-miniprogram';
import { saveBase64ToTempFile, addWatermarkToImage } from '../ai/util';

import { customOptionList } from './options';

const accountInfo = wx.getAccountInfoSync();
const logger = wx.getRealtimeLogManager();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    sharedToTimeline: false,
    colorPickerVisible: false,
    examplePickerVisible: false,
    tabValue: 0,
    activeStickyImage: false,
    navigatorProps: {
      url: '/pages/ai/privacy/index',
    },
    debugMode: accountInfo.miniProgram.envVersion === 'develop',
    loggedIn: false,
    customOptionList,
    loginLoadingVisible: false,
    inputValue: '',
    confirmBtn: { content: '确定', variant: 'outline' },
    uploadButtonSrc: `${CLOUD_STROAGE_PATH}/resources/ai/icon/upload.svg`,
    imageSrc: '',
    visible: false,
    progress: 0,
    privacyChecked: false,
    value0: 0,
    value1: 0,
    generatedImageSrc: '', //REVERT this
    // generatedImageSrc: './11.png', //REVERT this
    logoSrc: `${CLOUD_STROAGE_PATH}/resources/ai/logo.png`,
    src: '',
    customStyle: {
      title: {
        color: '#1C2023',
      },
      'buy-button': {
        'border-radius': '20rpx',
        'background-color': '#F8C301',
        color: 'white',
      },
    },
  },

  currentSelection: '',

  progressInterval: null,

  requestTask: null,

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ imageSrc: res.tempFiles[0].tempFilePath });
      },
    });
  },

  onSelectExampleImage(e) {
    if (e.detail.data.imageSrc) {
      this.setData({ imageSrc: e.detail.data.imageSrc });
    }
  },
  onRemoveImage() {
    this.setData({ imageSrc: '' });
  },

  onPrivacyChange(e) {
    this.setData({ privacyChecked: e.detail.checked });
  },

  onTabsChange(e) {
    this.setData({ tabValue: e.detail.value });
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
    if (options && options.imageSrc) {
      this.setData({ imageSrc: options.imageSrc, tabValue: options.isInterior === '1' ? 1 : 0 });
    }
  },

  onStickyChange(e) {
    if (e.detail.isFixed !== this.data.activeStickyImage) {
      this.setData({ activeStickyImage: e.detail.isFixed });
    }
  },

  previewInputImage() {
    wx.previewImage({
      current: this.data.imageSrc, // 当前显示图片的http链接
      urls: [this.data.imageSrc], // 需要预览的图片http链接列表
    });
  },

  async saveImage(e) {
    let tempFilePath = this.data.generatedImageSrc;
    // Extra processing, save base64 to temp file
    if (!this.data.watermarkRemoved) {
      tempFilePath = await saveBase64ToTempFile(this.data.generatedImageSrc);
    }
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: () => {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '保存成功',
          theme: 'success',
          direction: 'column',
        });
      },
      fail: (e) => {
        console.log(e);
        Toast({
          context: this,
          selector: '#t-toast',
          message: '保存失败, 请检查相册权限, 可尝试点击图片后长按保存',
          theme: 'error',
          direction: 'column',
        });
      },
    });
  },

  previewImage() {
    wx.previewImage({
      current: this.data.generatedImageSrc, // 当前显示图片的http链接
      urls: [this.data.imageSrc, this.data.generatedImageSrc], // 需要预览的图片http链接列表
    });
  },

  showInfoMessage(text) {
    Message.info({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content: text,
    });
  },
  async generate() {
    if (!this.data.imageSrc) {
      this.showInfoMessage('请先选择图片');
      return;
    }

    this.setData({ visible: true });
    wx.setKeepScreenOn({
      keepScreenOn: true,
    });

    let prompt = '';
    const selectedOptions = [];

    const selectedType = this.selectComponent(`#option-0`);

    const selectedColor = this.selectComponent(`#option-1`);
    selectedOptions.push({
      title: '家具',
      content: selectedType.data.selection,
    });
    selectedOptions.push({
      title: '颜色',
      content: selectedColor.data.color,
    });
    prompt = `你是一个专业的油漆工, 请将图片中的${selectedType.data.selection}颜色涂成${selectedColor.data.color}且表面没有木头纹理，并保持其他物体不变。`;

    this.progressInterval = setInterval(() => {
      if (this.data.progress < 99) {
        this.setData({ progress: this.data.progress + 1 });
      }
      if (!this.data.visible || this.data.generatedImageSrc) {
        clearInterval(this.progressInterval);
      }
    }, 500);

    if (this.data.debugMode) {
      console.log(prompt);
      console.log(selectedOptions);
    }

    // Rever this for testing;
    // if (this.data.debugMode) {
    //   this.setData({ visible: false });
    //   return;
    // }

    const fileManager = wx.getFileSystemManager();
    fileManager.readFile({
      filePath: this.data.imageSrc,
      encoding: 'base64',
      success: (fileRes) => {
        const imageBase64 = fileRes.data;
        const payload = {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inlineData: {
                    mimeType: 'image/jpeg', // 根据实际图片类型更改
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['IMAGE'],
          },
        };
        this.requestTask = wx.request({
          url: 'https://ai.zsthinkgood.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent',
          timeout: 240000,
          header: {
            'X-Client-Name': 'DIGITAL_GEMINI',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          data: JSON.stringify(payload),
          success: async (res) => {
            try {
              console.log(res);
              if (res.statusCode !== 200) {
                logger.info(res);
                throw new Error(res.statusCode);
              }
              console.log(res.data);

              const generatedPart = res.data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
              if (generatedPart) {
                const generatedImageBase64 = generatedPart.inlineData.data;
                const tempFileUrl = await saveBase64ToTempFile(generatedImageBase64);
                const imageSrc = await addWatermarkToImage(tempFileUrl);
                this.setData({ generatedImageSrc: imageSrc, progress: 0 });
              } else {
                throw 'No image generated.';
              }
            } catch (e) {
              logger.error(e);
              this.showErrorPopup(e);
            }
          },
          fail: (res) => {
            console.log(res);
            if (res?.errMsg !== 'request:fail abort') {
              if (res?.errno === 1300202) {
                this.showErrorPopup('存储空间不足，, 请尝试清理缓存');
              } else {
                this.showErrorPopup();
              }
              logger.error(res);
            }
          },
        });
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },

  showErrorPopup(text) {
    Message.error({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content: `服务器出错 ${text ? ` ${text}` : ''}`,
    });
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    this.setData({ visible: false, generatedImageSrc: null, progress: 0 });
    wx.setKeepScreenOn({
      keepScreenOn: false,
    });
  },

  closeOverlay() {
    if (this.requestTask) {
      this.requestTask.abort();
    }
    this.setData({ visible: false, generatedImageSrc: null, progress: 0 });
    wx.setKeepScreenOn({
      keepScreenOn: false,
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
  onUnload() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  },

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
      title: `数码彩AI`,
    };
  },

  onShareTimeline() {
    this.setData({ sharedToTimeline: true });
    return {
      title: `🔥数码彩AI🎨一键家具改色👍快来试试!`,
    };
  },
  goBack() {
    const pages = getCurrentPages();
    const stackDepth = pages.length;
    if (stackDepth > 1) {
      // There's a previous page to go back to
      wx.navigateBack({
        delta: 1,
      });
    } else {
      wx.switchTab({
        url: `/pages/explore/index`,
      });
    }
  },

  showExamplePicker() {
    this.setData({ examplePickerVisible: true });
  },
});
