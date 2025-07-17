// pages/portrait-ai/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;
import { Toast } from 'tdesign-miniprogram';
import Message from 'tdesign-miniprogram/message/index';

// Change here
const THEME = '曲靖超级家博会';
const PERSON = '今日杜总说';

const FormData = require('../ai/helper/formData.js');

const fs = wx.getFileSystemManager(); // 获取文件系统管理器实例
const accountInfo = wx.getAccountInfoSync();
const db = wx.cloud.database();
const _ = db.command;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    viewOnly: false,
    loadingReport: false,
    uploadButtonSrc: `${CLOUD_STROAGE_PATH}/resources/ai/icon/upload.svg`,
    isLoading: false,
    imageSrc: '',
    betaVersion: accountInfo.miniProgram.envVersion === 'develop' || accountInfo.miniProgram.envVersion === 'trial',
    loadingQRCode: true,
    qrcodeSrc: '',
    arrowSrc: `${CLOUD_STROAGE_PATH}/resources/portrait-ai/arrow.png`,
    robotSrc: `${CLOUD_STROAGE_PATH}/resources/portrait-ai/robot.png`,
    result: {},
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
    const cloudPath = `resources/portrait-ai/user_uploads/${this.data.id}.jpg`; // 云端文件路径，确保唯一性

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
    await this.uploadFileToCloud();
    console.log('解析后的 JSON：', parsed);
    this.setData({ result: parsed });

    await db.collection('portrait_report').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        primaryColor: parsed.primaryColor,
        secondaryColor: parsed.secondaryColor,
        compliment: parsed.compliment,
        reportid: this.data.id,
        createdAt: db.serverDate(),
      },
      success: (res) => {
        console.log(res);
      },
      fail: (err) => {
        console.log(err);
      },
    });

    this.generateQRCode();
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
    formData.append('model', 'gpt-image-1');
    formData.append('prompt', prompt);

    try {
      const base64Image = fs.readFileSync(this.data.imageSrc, 'base64', 0);
      const payload = {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `请分析上传的图片中人物的穿着，并输出以下 JSON 格式：
                {
                  "primaryColor": "提取人物穿着中占比最大的颜色，HEX 格式",
                  "secondaryColor": "提取人物穿着中次要但突出的颜色，HEX 格式",
                  "compliment": "对图中的人物衣着作出正面评价 1. 图中的人物先分析一个人还是多个人，性别不需要分析 2. 图中的人物分别给出对应衣服颜色评价，配饰发型等都不用，只是衣服。每个人评价不超过200字 3.评价需要正面，积极，正能量，用比较幽默风趣轻松的语言 4.评价需要跟 ${THEME} 相关 5.最后给赠与一句随机生成的正面的人生格言(关于事业拼搏有关的), 前面加上 "${PERSON}:" 6. 以上不用分开写，全部整合成一段文字"
                }
                请只输出纯 JSON 内容，不加解释。`,
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
        temperature: 0,
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
            const jsonStr = content.match(/{[\s\S]*}/)?.[0]; // 提取 {...} 部分
            const parsed = JSON.parse(jsonStr);
            this.onSuccess(parsed);
          } catch (e) {
            this.resetGame();
            Message.error({
              context: this,
              offset: [20, 32],
              duration: 2000,
              // single: false, // 打开注释体验多个消息叠加效果
              content: '无法识别到图片中的人物, 请重新尝试',
            });
            console.warn('⚠️ 模型返回的不是纯 JSON，可能需要清洗。');
          } finally {
            this.setData({ isLoading: false });
          }
          this.setData({ isLoading: false });
        },
        fail: (res) => {
          console.log(res);
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
        name: 'generateqrcode',
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
          console.log('WYF?');
        }
      })
      .catch((e) => {
        console.log(e);
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
      title: `我在${THEME}解锁了专属色彩寄语！快来看看！`,
      path: this.data.result ? `/pages/portrait-ai/index?reportId=${this.data.id}` : `/pages/portrait-ai/index`, // 分享到小程序的哪个页面
      imageUrl: this.data.analyzedImageSrc, // 可以使用分析后的图片作为分享缩略图
    };
  },
  onShareTimeline() {
    // 朋友圈分享
    return {
      query: this.data.result ? `reportId=${this.data.id}` : '',
      title: `我在${THEME}庆解锁了专属色彩寄语！快来看看！`,
    };
  },
});
