// pages/portrait-ai/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;
import { Toast } from 'tdesign-miniprogram';
import Message from 'tdesign-miniprogram/message/index';
import { toolDefinition } from './tool';
import {
  exteriorWallSolutions,
  interiorWallSolutions,
  glassSolutions,
  woodSolutions,
  steelSolutions,
} from './recommendation';

const FormData = require('../ai/helper/formData.js');

const fs = wx.getFileSystemManager(); // 获取文件系统管理器实例
const accountInfo = wx.getAccountInfoSync();
const db = wx.cloud.database();
const _ = db.command;

const reportTabLabels = ['墙身', '玻璃', '木制品', '金属制品'];
const reportTabProperty = ['mainWall', 'glass', 'wood', 'steel'];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wallType: '',
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
    solutions: [],
  },

  envVersion: accountInfo.miniProgram.envVersion,

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
    db.collection('portrait_report')
      .where({
        reportid: _.eq(reportId),
      })
      .get()
      .then((res) => {
        console.log(res);
        if (res && res.data && res.data.length > 0) {
          this.setData({
            id: reportId,
            viewOnly: true,
            qrcodeSrc: `${CLOUD_STROAGE_PATH}/resources/portrait-ai/qrcode/${reportId}.png`,
            imageSrc: `${CLOUD_STROAGE_PATH}/resources/portrait-ai/user_uploads/${reportId}.jpg`,
            result: {
              primaryColor: res.data[0].primaryColor,
              secondaryColor: res.data[0].secondaryColor,
              compliment: res.data[0].compliment,
            },
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
    this.setData({
      qrcodeSrc: '',
      result: {},
      wallType: '',
      isLoading: false,
      viewOnly: false,
      imageSrc: '',
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      result: {},
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
      sizeType: ['original'],
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

  uploadFileToCloud() {
    const cloudPath = `resources/diagnosis-ai/user_uploads/${this.data.id}.jpg`; // 云端文件路径，确保唯一性

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

  async onSuccess(parsed) {
    // await this.uploadFileToCloud();
    console.log('解析后的 JSON：', parsed);
    this.setData({ result: parsed });
    this.processResult(parsed);
    // Save data
    // await db.collection('portrait_report').add({
    //   // data 字段表示需新增的 JSON 数据
    //   data: {
    //     primaryColor: parsed.primaryColor,
    //     secondaryColor: parsed.secondaryColor,
    //     compliment: parsed.compliment,
    //     reportid: this.data.id,
    //     createdAt: db.serverDate(),
    //   },
    //   success: (res) => {
    //     console.log(res);
    //   },
    //   fail: (err) => {
    //     console.log(err);
    //   },
    // });

    // this.generateQRCode();
  },

  async generate() {
    // this.setData({
    //   result: {
    //     isLoading: false,
    //     compliment:
    //       '在数码彩20周年庆的盛会上，您的穿着如同一抹深邃的夜空，稳重而不失优雅，仿佛为这场盛会增添了一份宁静的力量。那深邃的色调，犹如数码彩涂料的经典色系，历久弥新，令人难以忘怀。而您衣着中的次要色调，如同沙滩上的细沙，温暖而柔和，正如数码彩在涂料行业中不断创新的精神，温暖着每一位与会者的心。您的穿着不仅展现了个人的品味，更与数码彩的品牌精神相得益彰，仿佛在诉说着一个关于色彩与创新的故事。在这场庆典中，您的存在如同一幅精美的画作，完美地诠释了数码彩20年来的辉煌历程。',
    //     primaryColor: '#1A1A1A',
    //     secondaryColor: '#D2B48C',
    //   },
    // });
    // return;

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
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              '你是一个建筑分析专家，接收用户上传的图片，并生成结构化分析报告。每个字段的 surfaceCondition 和 damageNotes 字段必须包含 3 条及以上的自然语言说明，用 1. 2. 3. 的格式列出。',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '对图片中的墙身,进行全面评估。生成结构化 JSON 报告，每个字段必须写得详细、专业、像在写报告一样。请以专家身份完整分析。',
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
        tool_choice: { type: 'function', function: { name: 'generateWallAnalysisReport' } },
        temperature: 0.3,
      };

      wx.request({
        url: 'https://ai.zsthinkgood.com/v1/chat/completions',
        method: 'POST',
        data: payload,
        header: {
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
              content: '发生错误, 可能没有检测到建筑...',
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
    const temp = {
      wallType: '内墙',
      innerWallReport: {
        basicInfo: {
          wallFinishing: '瓷砖墙面',
        },
        mainWall: {
          material: '瓷砖',
          surfaceCondition: [
            '1. 瓷砖表面整体较为平整，但局部存在轻微的污渍和水渍痕迹。',
            '2. 表面光泽度尚可，但在某些区域有轻微的磨损迹象。',
            '3. 接缝处的填缝剂有轻微变色，影响整体美观。',
          ],
          damageNotes: [
            '1. 局部区域可能存在渗水风险，建议进行密封处理。',
            '2. 瓷砖接缝处可能会出现开裂现象，需定期检查维护。',
            '3. 若长期不处理，可能导致瓷砖脱落，影响使用安全。',
          ],
        },
        glass: {
          surfaceCondition: ['1. 玻璃表面较为干净，但有少量指纹和灰尘。', '2. 边缘处有轻微的老化痕迹。'],
          damageNotes: ['1. 玻璃可能存在轻微松动，建议检查固定情况。', '2. 若不及时维护，可能会出现裂痕，影响安全性。'],
        },
        wood: {
          surfaceCondition: ['1. 木制品表面漆面部分老化，光泽度下降。', '2. 柜门边缘有轻微的磨损痕迹。'],
          damageNotes: [
            '1. 柜体下部可能因受潮出现变形，建议进行防潮处理。',
            '2. 柜门合页处有轻微松动，需定期紧固以确保正常使用。',
          ],
        },
        steel: {
          surfaceCondition: ['1. 不锈钢表面有轻微的水斑和指纹痕迹。', '2. 部分区域有轻微的划痕。'],
          damageNotes: [
            '1. 若不及时清理，可能导致不锈钢表面腐蚀，影响美观。',
            '2. 建议定期进行清洁和保养，以延长使用寿命。',
          ],
        },
      },
    };
    // this.processResult(temp);
  },

  processResult(data) {
    console.log('Finding solution');
    const { wallType } = data;
    this.setData({ wallType: wallType });
    const result = wallType === '外墙' ? data.outerWallReport : data.innerWallReport;

    const tempReportTabLabels = ['墙身'];
    const tempReportTabPropertys = ['mainWall'];
    if (wallType === '外墙') {
      const solutions = exteriorWallSolutions.find((item) => {
        return item.wallType.includes(result.basicInfo.wallFinishing);
      });
      result.mainWall.solutions = solutions.solutions;
    } else if (wallType === '内墙') {
      const solutions = interiorWallSolutions.find((item) => {
        return item.wallType.includes(result.basicInfo.wallFinishing);
      });
      result.mainWall.solutions = solutions.solutions;
      // Hardcode index=0 for now.
      if (result.glass && result.glass.surfaceCondition) {
        result.glass.solutions = glassSolutions[0].solutions;
        tempReportTabLabels.push('玻璃');
        tempReportTabPropertys.push('glass');
      }
      if (result.wood && result.wood.surfaceCondition) {
        result.wood.solutions = woodSolutions[0].solutions;
        tempReportTabLabels.push('木制品');
        tempReportTabPropertys.push('wood');
      }
      if (result.steel && result.steel.surfaceCondition) {
        result.steel.solutions = steelSolutions[0].solutions;
        tempReportTabLabels.push('金属制品');
        tempReportTabPropertys.push('steel');
      }
    }
    console.log(result);

    this.setData({ result: result, reportTabLabels: tempReportTabLabels, reportTabProperty: tempReportTabPropertys });
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
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: '我的房屋报告, 点击查看!',
      path: this.data.result ? `/pages/diagnosis-ai/index?reportId=${this.data.id}` : `/pages/diagnosis-ai/index`, // 分享到小程序的哪个页面
      imageUrl: this.data.analyzedImageSrc, // 可以使用分析后的图片作为分享缩略图
    };
  },
  onShareTimeline() {
    // 朋友圈分享
    return {
      query: this.data.result ? `reportId=${this.data.id}` : '',
      title: '我的房屋报告, 点击查看!',
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
