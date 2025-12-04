// pages/portrait-ai/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;
import { Toast } from 'tdesign-miniprogram';
import Message from 'tdesign-miniprogram/message/index';
import { toolDefinition } from './tool';
import {
  getLocalUserInfo,
  fetchUserInfo,
  saveUserHistoryLocally,
  saveUserInfoLocally,
} from '../../services/user/service';
const FormData = require('../ai/helper/formData.js');

const fs = wx.getFileSystemManager(); // 获取文件系统管理器实例
const accountInfo = wx.getAccountInfoSync();
const db = wx.cloud.database();
const _ = db.command;

const CREDITS_PER_USAGE = 5;

const reportTabLabels = ['风格推荐', '色彩搭配', '面积估算', '住户现况', '风水', '搭配植物'];
const reportTabProperty = [
  'recommendedStyle',
  'recommendedColorScheme',
  'wallAreaEstimation',
  'residentAnalysis',
  'fengshui',
  'recommendedPlants',
];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showNoBuildingPopup: false,
    userInfo: {},
    activeValues: [],
    hasResult: false,
    showLoginPopup: false,
    reportTabLabels,
    reportTabProperty,
    examplePickerVisible: false,
    viewOnly: false,
    loadingReport: false,
    uploadButtonSrc: `${CLOUD_STROAGE_PATH}/resources/ai/icon/upload.svg`,
    isLoading: false,
    imageSrc: '',
    betaVersion: accountInfo.miniProgram.envVersion === 'develop' || accountInfo.miniProgram.envVersion === 'trial',
    qrcodeSrc: '',
    productRecommendationSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/product_recommendation.png`,
    arrowSrc: `${CLOUD_STROAGE_PATH}/resources/portrait-ai/arrow.png`,
    robotSrc: `${CLOUD_STROAGE_PATH}/resources/diagnosis-ai/banner_bg.png`,
    result: {},
  },

  needToDownloadImage: false,
  loggedIn: false,

  envVersion: accountInfo.miniProgram.envVersion,

  checkLoginStatus() {
    if (this.loggedIn) {
      return true;
    }
    this.setData({ showLoginPopup: true });
    return false;
  },

  onUnauthorized() {
    this.checkLoginStatus();
  },

  onLoginSuccess(e) {
    console.log(e);
    Message.success({
      context: this,
      offset: [20, 32],
      duration: 3000,
      content: '登陆成功',
    });
    this.loggedIn = true;
    this.setData({ showLoginPopup: false, userInfo: e.detail });
  },

  showErrorPopup(text) {
    Message.error({
      context: this,
      offset: [20, 32],
      duration: 3000,
      content: `服务器出错 ${text ? ` ${text}` : ''}`,
    });
  },

  handlePanelChange(e) {
    // console.log(e.detail.value);
    this.setData({
      activeValues: e.detail.value,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    if (options && options.reportId) {
      this.loadReport(options.reportId);
    } else {
      this.setData({
        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      });
    }
  },

  loadReport(reportId) {
    this.setData({ loadingReport: true });
    db.collection('area_ai_report')
      .where({
        reportid: _.eq(reportId),
      })
      .get()
      .then(async (res) => {
        console.log(res);
        if (res && res.data && res.data.length > 0) {
          this.processResult(res.data[0].detail);
          this.needToDownloadImage = true;
          this.setData({
            id: reportId,
            imageSrc: `${CLOUD_STROAGE_PATH}/resources/area-ai/user_uploads/${reportId}.jpg`,
            loadingReport: false,
          });
        } else {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '加载失败',
            theme: 'error',
            direction: 'column',
          });
        }
      });
  },

  resetGame() {
    this.needToDownloadImage = false;
    this.setData({
      qrcodeSrc: '',
      result: {},
      hasResult: false,
      isLoading: false,
      viewOnly: false,
      imageSrc: '',
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100,
    });
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['original', 'compressed'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        this.setData({ imageSrc: res.tempFiles[0].tempFilePath });
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },

  openViewer() {
    if (!this.data.imageSrc) {
      return;
    }
    wx.previewImage({
      current: this.data.imageSrc,
      urls: [this.data.imageSrc],
    });
  },

  previewSolutionImage(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.imageSrc,
      urls: [e.currentTarget.dataset.imageSrc],
    });
  },

  uploadFileToCloud() {
    const cloudPath = `resources/area-ai/user_uploads/${this.data.id}.jpg`; // 云端文件路径，确保唯一性

    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: this.data.imageSrc, // 文件路径
      success: (res) => {
        // get resource ID
        console.log(res.fileID);
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },

  processTransacation() {
    wx.cloud
      .callFunction({
        // 云函数名称
        name: 'updateuserinfo',
        // 传给云函数的参数
        data: {
          type: 'CONSUME',
          credits: CREDITS_PER_USAGE,
          phoneNumber: this.data.userInfo.phoneNumber,
        },
      })
      .then((res) => {
        if (res.result.errCode === 0) {
          saveUserInfoLocally(res.result.userInfo);
          this.setData({
            userInfo: res.result.userInfo,
          });
        }
      });
  },

  closeDialog(e) {
    this.setData({ showNoBuildingPopup: false });
  },

  async onSuccess(parsed) {
    console.log('解析后的 JSON：', parsed);
    console.log(this.data);
    // Save report
    // TODO, revert this
    // await db.collection('area_ai_report').add({
    //   // data 字段表示需新增的 JSON 数据
    //   data: {
    //     reportid: this.data.id,
    //     user: this.data.userInfo.phoneNumber,
    //     detail: parsed,
    //     time: db.serverDate(),
    //     createdAt: db.serverDate(),
    //   },
    //   success: (res) => {
    //     console.log(res);
    //   },
    //   fail: (err) => {
    //     console.log(err);
    //   },
    // });
    await this.uploadFileToCloud();

    try {
      this.processResult(parsed);
      await this.processTransacation();
    } catch (e) {}

    // this.generateQRCode();
  },

  async generate() {
    if (!this.checkLoginStatus()) {
      return;
    }

    if (this.data.userInfo.credits < CREDITS_PER_USAGE) {
      Message.info({
        context: this,
        offset: [20, 32],
        duration: 2000,
        // single: false, // 打开注释体验多个消息叠加效果
        content: '积分不足, 无法诊断',
      });
      return;
    }

    if (!this.data.imageSrc) {
      Message.info({
        context: this,
        offset: [20, 32],
        duration: 2000,
        // single: false, // 打开注释体验多个消息叠加效果
        content: '请先选择图片',
      });
      return;
    }

    this.setData({ isLoading: true });
    const formData = new FormData();
    formData.appendFile('image[]', this.data.imageSrc);
    console.log(this.data.imageSrc);
    formData.append('model', 'gpt-image-1');

    try {
      const base64Image = fs.readFileSync(this.data.imageSrc, 'base64', 0);
      const payload = {
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content:
              '你是一名专业的内墙装修分析专家。你的任务是：根据用户上传的内墙图片，提供全面的装修分析报告，包括推荐风格、色彩搭配、面积估算、住户分析、风水建议和植物推荐。输出必须通过函数调用的方式，以结构化 JSON 形式返回，每个字段都要详细、专业、实用。',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text:
                  '请根据这张内墙图片，进行全面分析，生成包含以下6个维度的详细报告：\n' +
                  '1. 推荐风格：根据空间特点推荐合适的装修风格，并说明理由\n' +
                  '2. 推荐色彩搭配：提供主色调和辅助色彩方案，说明设计理念\n' +
                  '3. 估算墙面面积：估算可用涂料/乳胶漆覆盖的墙面面积，给出估算区间和置信度\n' +
                  '4. 住户现况：分析图片中的信息，推测家庭结构、年龄、审美偏好、消费能力，并给出针对性的装修销售建议\n' +
                  '5. 风水：提供风水评估和改善建议，包括色彩和布局建议\n' +
                  '6. 推荐搭配植物：推荐适合的室内植物，说明摆放位置和好处\n' +
                  '请确保每个维度都详细、专业、实用。',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        tools: toolDefinition,
        tool_choice: {
          type: 'function',
          function: { name: 'generateInteriorWallAnalysisReport' },
        },
        service_tier: 'priority',
      };

      wx.request({
        url: 'https://ai.zsthinkgood.com/v1/chat/completions',
        method: 'POST',
        data: payload,
        header: {
          'X-Client-Name': 'DIGITAL',
          'content-type': 'application/json', // 默认值
        },
        success: (res) => {
          console.log(res);

          try {
            const { content } = res.data.choices[0].message;
            console.log('模型原始输出：', content);
            const jsonStr = res.data.choices[0].message.tool_calls[0].function.arguments;
            const parsed = JSON.parse(jsonStr);
            console.log(parsed);
            this.onSuccess(parsed);
          } catch (e) {
            console.log(e);
            this.resetGame();
            Message.error({
              context: this,
              offset: [20, 32],
              duration: 2000,
              // single: false, // 打开注释体验多个消息叠加效果
              content: '服务器出错啦...请稍候再试',
            });
          } finally {
            this.setData({ isLoading: false });
          }
          this.setData({ isLoading: false });
        },
        fail: (res) => {
          console.log(res);
          Message.error({
            context: this,
            offset: [20, 32],
            duration: 2000,
            // single: false, // 打开注释体验多个消息叠加效果
            content: '服务器出错了...',
          });
          this.setData({ isLoading: false });
        },
      });
    } catch (e) {
      console.error(e);
      this.resetGame();
    }
  },

  generateQRCode() {
    wx.cloud
      .callFunction({
        // 云函数名称
        name: 'generatediagnosisaiqrcode',
        // 传给云函数的参数
        data: {
          reportId: this.data.id,
          envVersion: this.envVersion,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.result.success) {
          this.setData({
            qrcodeSrc: `${CLOUD_STROAGE_PATH}/resources/portrait-ai/qrcode/${this.data.id}.png`, // 注意前缀
          });
        } else {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '生成二维码失败',
            theme: 'error',
            direction: 'column',
          });
          console.log('WTF?');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // const temp = {
    //   wallType: '内墙',
    //   innerWallReport: {
    //     basicInfo: {
    //       wallFinishing: '瓷砖墙面',
    //     },
    //     mainWall: {
    //       material: '马赛克面 / 瓷砖面 / 铝板 / 铝塑板',
    //       surfaceCondition: [
    //         '1. 瓷砖表面整体较为平整，但局部存在轻微的污渍和水渍痕迹。',
    //         '2. 表面光泽度尚可，但在某些区域有轻微的磨损迹象。',
    //         '3. 接缝处的填缝剂有轻微变色，影响整体美观。',
    //       ],
    //       damageNotes: [
    //         '1. 局部区域可能存在渗水风险，建议进行密封处理。',
    //         '2. 瓷砖接缝处可能会出现开裂现象，需定期检查维护。',
    //         '3. 若长期不处理，可能导致瓷砖脱落，影响使用安全。',
    //       ],
    //     },
    //     glass: {
    //       surfaceCondition: ['1. 玻璃表面较为干净，但有少量指纹和灰尘。', '2. 边缘处有轻微的老化痕迹。'],
    //       damageNotes: ['1. 玻璃可能存在轻微松动，建议检查固定情况。', '2. 若不及时维护，可能会出现裂痕，影响安全性。'],
    //     },
    //     wood: {
    //       surfaceCondition: ['1. 木制品表面漆面部分老化，光泽度下降。', '2. 柜门边缘有轻微的磨损痕迹。'],
    //       damageNotes: [
    //         '1. 柜体下部可能因受潮出现变形，建议进行防潮处理。',
    //         '2. 柜门合页处有轻微松动，需定期紧固以确保正常使用。',
    //       ],
    //     },
    //     steel: {
    //       surfaceCondition: ['1. 不锈钢表面有轻微的水斑和指纹痕迹。', '2. 部分区域有轻微的划痕。'],
    //       damageNotes: [
    //         '1. 若不及时清理，可能导致不锈钢表面腐蚀，影响美观。',
    //         '2. 建议定期进行清洁和保养，以延长使用寿命。',
    //       ],
    //     },
    //   },
    // };
    // this.processResult(temp); //TODO Rever this!
  },

  processResult(data) {
    console.log('Processing result');
    console.log(data);
    // 直接使用返回的数据，因为已经是完整的报告结构
    this.setData({
      result: data,
      hasResult: true,
    });
  },

  async navigateToAI(e) {
    let { imageSrc } = this.data;
    if (this.needToDownloadImage) {
      const { tempFilePath } = await wx.cloud.downloadFile({
        fileID: imageSrc,
      });
      imageSrc = tempFilePath;
    }
    wx.navigateTo({
      url: `/pages/ai/index?isInterior=1&imageSrc=${imageSrc}`,
    });
  },

  navigateToProduct(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/product-detail/index?productId=${id}`,
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const userInfo = getLocalUserInfo();
    if (userInfo && userInfo.phoneNumber) {
      this.loggedIn = true;
      this.setData({ userInfo });
    }
  },

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

  // 显示分享引导 Overlay
  showShareGuideOverlay() {
    this.setData({
      showGuideOverlay: true,
    });
  },

  // 隐藏分享引导 Overlay（点击任意处隐藏）
  hideShareGuideOverlay() {
    this.setData({
      showGuideOverlay: false,
    });
  },

  // 用户点击分享按钮时触发（open-type="share"）
  onShareAppMessage() {
    return {
      title: this.data.hasResult ? '数码彩AI内墙分析报告, 点击查看!' : '🤩 数码彩AI - 内墙智能分析, 快来试试!',
      path: this.data.hasResult ? `/pages/area-ai/index?reportId=${this.data.id}` : `/pages/area-ai/index`, // 分享到小程序的哪个页面
    };
  },
  onShareTimeline() {
    // 朋友圈分享
    return {
      query: this.data.hasResult ? `reportId=${this.data.id}` : '',
      title: this.data.hasResult ? '数码彩AI内墙分析报告, 点击查看!' : '🤩 数码彩AI - 内墙智能分析, 快来试试!',
    };
  },
  showExamplePicker() {
    this.setData({ examplePickerVisible: true });
  },

  onRemoveImage() {
    this.setData({ imageSrc: '' });
  },

  onSelectExampleImage(e) {
    if (e.detail.data.imageSrc) {
      this.setData({ imageSrc: e.detail.data.imageSrc });
    }
  },
});
