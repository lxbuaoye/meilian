const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = getApp().globalData;
import Message from 'tdesign-miniprogram/message/index';
import { saveBase64ToTempFile, addWatermarkToImage } from './util';
import { Toast } from 'tdesign-miniprogram';
import {
  getLocalUserInfo,
  fetchUserInfo,
  saveUserHistoryLocally,
  saveUserInfoLocally,
} from '../../../services/user/service';

import {
  exteriorCustomOptionList,
  interiorCustomOptionList,
  xuanwuCustomOptionList,
  dgpickCustomOptionList,
} from './options';
import { fetchProducts, fetchCompressedColorCards } from '../../../services/product/service';

// 服务里导出的是 { FormData, getFileNameFromPath }
const { FormData } = require('../../../services/wx-formdata/formData.js');

const CREDITS_PER_USAGE = 10;
const accountInfo = wx.getAccountInfoSync();
const logger = wx.getRealtimeLogManager();

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
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
    exteriorCustomOptionList: exteriorCustomOptionList,
    interiorCustomOptionList: interiorCustomOptionList,
    xuanwuCustomOptionList: xuanwuCustomOptionList,
    dgpickCustomOptionList: dgpickCustomOptionList,
    category: ['外墙', '内墙'],
    loginLoadingVisible: false,
    inputValue: '',
    confirmBtn: { content: '确定', variant: 'outline' },
    uploadButtonSrc: `${CLOUD_STROAGE_PATH}/resources/ai/icon/upload.svg`,
    imageSrc: '',
    // 产品相关数据
    products: [],
    selectedProductMap: {},
    loadingProducts: true,
    compressedColorCardsUrl: '',
    styleOptionsForInterior: [
      {
        name: '一键翻新',
        prompt:
          '把图中这个空间墙面翻新成现代风格 1.把旧墙面的孔洞，发霉等补平整 2.颜色可以用1个，或者2个，或者3个，但搭配的颜色要和谐，现代，给人简洁舒适的感觉 3.软装需要和墙面颜色搭配，给人清新安静的感觉 4.可以根据情况加入绿植作为点缀 5.如果有窗户，把没有玻璃的窗户加玻璃窗6.图中建筑结构和布局不改变， 图片比例不改变',
      },
      {
        name: '新中式',
        prompt:
          '把这个空间设计成新中式风格，融合传统中式元素与现代简约审美，但不能改变图中建筑结构和布局，也不能改变图片比例，具体改造要求如下：1. 整体色调：主色调为米色与木色，营造出温润雅致的氛围；2. 家具造型：采用传统中式家具造型，线条简洁、结构严谨；3. 墙面装饰：背景墙以浅色涂料为底，视觉柔和；适合的地方可以挂一幅水墨山水画圆形挂饰，浓浓东方意境；局部墙体可以采用中式格栅与木饰面结合，强化中式元素；4. 桌面布置简洁，一枝梅花盆景、茶具组合，突显东方茶文化；5. 空间氛围：整个空间清新典雅，气质内敛，适合喜欢东方文化、注重生活仪式感的人群。既有传统的文化韵味，又不失现代的舒适与实用性。',
      },
      {
        name: '现代极简',
        prompt:
          '把图中空间设计成现代极简风，但不能改变图中建筑结构和布局，也不能改变图片比例，具体改造要求如下： 1.色调整体采用米白色与浅木色为主色调，搭配黑色细节，营造出干净明亮，温和温馨的空间感； 2.大面积留白：墙面、天花和地砖都采用浅色处理，增强空间通透感； 3.简洁线条的家具，体现现代极简主义精神；4.低饱和软装：装饰物与家具色彩低调，配合统一氛围； 5.混搭元素：加入传统壁灯、现代吊灯和自然风干花，形成不刻意的"松弛感"；6.大面积引入自然光线，整体空间通透明亮。',
      },
      {
        name: '奶油风',
        prompt:
          '把这个空间改造翻新，但不能改变图中建筑结构和布局，也不能改变图片比例，具体改造要求如下：1. 主色调：米白、奶油色、浅杏色、香槟色等暖色系；搭配卡其色和胡桃木色节；2. 与墙面同色的哑光地面，增强整体温润感；3. 极简但有趣的装饰：如几何摆件、干花、香薰蜡烛；4. 抽象挂画：挂画风格简约但富有设计感，强化空间调性；5. 空间布局流畅，视觉连贯性强；6.搭配家居细节以圆角为主。',
      },
      {
        name: '田园风',
        prompt:
          '把图中空间设计改造成现代田园风格，但不能改变图中建筑结构和布局，也不能改变图片比例，具体要求如下：1.整体空间色彩搭配柔和自然：主色调为米白、浅木色、绿色、卡其色等大地色系，强调与自然的和谐；绿色柜子与绿植相呼应，营造田园气息。2.材质选用自然质朴：使用大量原木材质、藤编家具、棉麻布艺等天然材质； 地板为木纹/人字拼木地板，增强温润感。3. 软装细节体现生活感：多用干花、陶瓷器皿、靠垫、地毯等提升空间温度；桌面与墙面装饰都偏简洁，富有生活气息。',
      },
      {
        name: '法式风',
        prompt: '把图中空间改造翻新成法式风，输出实景图，但不能改变图中建筑结构和布局，也不能改变图片比例',
      },
      {
        name: '现代复古',
        prompt:
          '把图中空间翻新成现代老钱风混搭风格，具体要求: 1. 色彩搭配以中性色和低饱和度色彩为主。常见的有米白色、深木色、橄榄绿、驼色等; 2. 点缀适量绿植和鲜花; 3. 输出实景图; 4. 不改变图中空间布局',
      },
      {
        name: '轻奢风',
        prompt: '把图中空间改造翻新成轻奢风，输出实景图，但不能改变图中建筑结构和布局，也不能改变图片比例',
      },
      {
        name: '欧式风',
        prompt: '把图中空间改造翻新成欧式风，输出实景图，但不能改变图中建筑结构和布局，也不能改变图片比例',
      },
      {
        name: '童趣风',
        prompt: '把图中空间布置成简约童趣风设计，可改变墙面颜色，装饰和软装布置等，保持空间布局不变, 输出实景图',
      },
      {
        name: '玄武系列',
        prompt: '',
      },
      {
        name: '自定义',
        prompt: '',
      },
    ],
    interiorPaintsOptionsActive: false,
    interiorPaintsColorOnly: false,
    visible: false,
    progress: 0,
    privacyChecked: false,
    value0: 0,
    value1: 0,
    generatedImageSrc: '',
    logoSrc: `${CLOUD_STROAGE_PATH}/resources/ai/logo.png`,
    src: '',
    navBackIcon: `${CLOUD_IMAGE_BASE}/image/area-ai/back@2x.png`,
    uploadIcon: `${CLOUD_IMAGE_BASE}/image/area-ai/upload_image@2x.png`,
    sectionDot: `${CLOUD_IMAGE_BASE}/image/area-ai/title@2x.png`,
    productIcon: `${CLOUD_IMAGE_BASE}/image/area-ai/product.png`,
    selectedIcon: `${CLOUD_IMAGE_BASE}/image/area-ai/selected@2x.png`,
    resultCloseIcon: `${CLOUD_IMAGE_BASE}/image/area-ai/wrong.png`,
    resultImage: `${CLOUD_IMAGE_BASE}/image/area-ai/pic.png`,
    resultDot: `${CLOUD_IMAGE_BASE}/image/area-ai/title.png`,
    // 产品展示配置
    visibleProductsCount: 8,
    visibleProducts: [],
    showMoreModal: false,
    // 用户在自定义选项中每组的选择状态
    interiorOptionSelections: [],
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
        const originalImagePath = res.tempFiles[0].tempFilePath;

        wx.compressImage({
          src: originalImagePath,
          quality: 80,
          success: (compressRes) => {
            // 压缩成功，使用压缩后的图片路径
            this.setData({ imageSrc: compressRes.tempFilePath });
          },
          fail: (err) => {
            console.error('图片压缩失败', err);
            // 压缩失败，回退到使用原始图片路径
            this.setData({ imageSrc: originalImagePath });
          },
        });
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

  onChange0(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ value0: index });
    // 仅当选择“自定义”时弹出自定义选项，不再对“玄武系列”自动展开产品选择
    if (this.data.styleOptionsForInterior[index].name === '自定义') {
      this.setData({
        interiorPaintsOptionsActive: true,
        interiorPaintsColorOnly: false,
      });
      wx.pageScrollTo({
        selector: `#interior-${index}`,
        // 50 = 40 filter bar height + 10 filter bar offset
        offsetTop: 0 - this.data.menuBarHeight - this.data.menuBarTop - 50,
      });
    } else {
      this.setData({ interiorPaintsOptionsActive: false });
    }
  },

  onChange1(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ value1: index });
    if (
      this.data.styleOptionsForExterior[index].name === '自定义' ||
      this.data.styleOptionsForExterior[index].name === '一键换色'
    ) {
      this.setData({
        exteriorPaintsOptionsActive: true,
        exteriorPaintsColorOnly: this.data.styleOptionsForExterior[index].name === '一键换色',
      });
      wx.pageScrollTo({
        selector: `#exterior-${index}`,
        // 50 = 40 filter bar height + 10 filter bar offset
        offsetTop: 0 - this.data.menuBarHeight - this.data.menuBarTop - 50,
      });
    } else {
      this.setData({ exteriorPaintsOptionsActive: false });
    }
  },

  async onLoad(options) {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      const navBarHeight = 44;
      this.setData({
        statusBarHeight,
        navBarHeight
      });
    } catch (e) {
      // ignore
    }
    if (options && options.referrer) {
      console.log(options);
      getApp().globalData.referrer = options.referrer;
    }
    const menuButton = wx.getMenuButtonBoundingClientRect();
    this.setData({
      menuBarTop: menuButton.top,
      menuBarHeight: menuButton.height,
    });
    if (options && options.imageSrc) {
      this.setData({ imageSrc: options.imageSrc, tabValue: options.isInterior === '1' ? 1 : 0 });
    }

    // 加载产品数据
    await this.loadProducts();
  },

  async loadProducts() {
    try {
      this.setData({ loadingProducts: true });
      const products = await fetchProducts();
      // 获取compressed_color_cards缩略图URL
      let compressedColorCardsUrl = '';
      try {
        compressedColorCardsUrl = await fetchCompressedColorCards();
      } catch (e) {
        console.warn('获取压缩色卡失败，使用默认图片', e);
      }

      const mapped = products.map((product) => {
        const rawCode = product.colorCode || product.cpmc || product.colorName || '';
        // Remove leading alphanumeric/hyphen characters and optional following space
        const displayName = rawCode.replace(/^[A-Za-z0-9-]+\s*/, '');

        return {
          id: product._id || product._id || product._id, // Keep existing ID logic, though redundant
          name: product.name || product.colorName || product.cpmc || '',
          imageSrc: product.imageSrc || compressedColorCardsUrl || product.thumbnail || product.image || '',
          colorCode: rawCode,
          displayName: displayName,
          category: product.category || '',
        };
      });

      this.setData({
        products: mapped,
        visibleProducts: mapped.slice(0, this.data.visibleProductsCount),
        compressedColorCardsUrl,
        loadingProducts: false,
      });
    } catch (e) {
      console.error('加载产品数据失败', e);
      this.setData({ loadingProducts: false });
      Message.error({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '加载产品数据失败',
      });
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
    const tempFilePath = await saveBase64ToTempFile(this.data.generatedImageSrc);
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

  onShow() {
    // 再次调用，确保胶囊和分享菜单被隐藏（有些端需在 onShow 调用）
    wx.hideHomeButton && wx.hideHomeButton();
    wx.hideShareMenu && wx.hideShareMenu();
  },

  onBackTap() {
    wx.navigateBack({ delta: 1 });
  },

  onChooseImage() {
    this.chooseImage();
  },

  onSelectProduct(e) {
    const productId = e.currentTarget.dataset.index;
    this.setData({
      [`selectedProductMap.${productId}`]: !this.data.selectedProductMap?.[productId],
    });
  },

  onSelectInteriorOption(e) {
    try {
      const group = Number(e.currentTarget.dataset.group);
      const idx = Number(e.currentTarget.dataset.index);
      if (Number.isNaN(group) || Number.isNaN(idx)) return;
      const groupData = this.data.interiorCustomOptionList[group];
      const option = groupData && groupData.data && groupData.data[idx];
      const selection = option ? option.name : '';
      const shouldDownload = !!(option && option.shouldDownload);
      const inputImageSrc = option && (option.inputImageSrc || option.imageSrc) ? (option.inputImageSrc || option.imageSrc) : '';
      const color = option && option.color ? option.color : '';
      const header = groupData && groupData.header ? groupData.header : '';

      const updated = this.data.interiorOptionSelections ? this.data.interiorOptionSelections.slice() : [];
      updated[group] = {
        selection,
        selectionIndex: idx,
        shouldDownload,
        inputImageSrc,
        header,
        color,
      };
      this.setData({ interiorOptionSelections: updated });
    } catch (err) {
      console.error('onSelectInteriorOption error', err);
    }
  },

  openMoreCards() {
    this.setData({ showMoreModal: true });
  },

  closeMoreCards() {
    this.setData({ showMoreModal: false });
  },

  onSelectCraft(e) {
    const index = Number(e.currentTarget.dataset.index);
    this.setData({
      [`selectedCraftMap.${index}`]: !this.data.selectedCraftMap?.[index],
    });
  },

  onGenerateTap() {
    // 允许用户仅选择风格即可触发 AI 生成（产品为可选）
    // 保留后续 generate() 内对特定风格（如玄武系列）对颜色/产品的校验逻辑
    this.generate();
  },

  onCloseResult() {
    this.setData({
      resultVisible: false,
    });
  },

  async generate() {
    if (!this.data.imageSrc) {
      this.showInfoMessage('请先选择图片');
      return;
    }
    // 跳过登录/积分检查：允许直接调用AI生成

    this.setData({ visible: true });
    wx.setKeepScreenOn({
      keepScreenOn: true,
    });

    const formData = new FormData();
    formData.appendFile('image[]', this.data.imageSrc);
    let prompt = '';
    const selectedOptions = [];

    // 获取选择的色卡产品
    const selectedProducts = Object.keys(this.data.selectedProductMap)
      .filter(key => this.data.selectedProductMap[key])
      .map(key => this.data.products.find(p => p.id === key))
      .filter(Boolean);

    const currentStyle = this.data.styleOptionsForInterior[this.data.value0].name;

    // 如果没有选择产品但选择了玄武系列或其他需要颜色的风格，使用默认颜色
    if (selectedProducts.length === 0 && (this.data.value0 === 10 || this.data.value0 === 11)) {
      this.showInfoMessage('请选择色卡产品或使用自定义颜色');
      return;
    }

    // 添加选择的色卡信息到selectedOptions
    if (selectedProducts.length > 0) {
      selectedOptions.push({
        title: '选择的色卡',
        content: selectedProducts.map(p => `${p.name} (${p.colorCode})`).join(', '),
      });
    }

    // 内墙处理（室内装修场景）
    selectedOptions.push({
      title: '风格',
      content: currentStyle,
    });
    if (currentStyle === '自定义') {
      // 使用已选的自定义选项中的 prompt 字段直接拼接为 AI 调用的提示词（选中什么用什么 prompt）
      const downloadList = [];
      const selections = this.data.interiorOptionSelections || [];
      const promptParts = [];

      this.data.interiorCustomOptionList.forEach((group, gIndex) => {
        const sel = selections[gIndex];
        let chosen = null;
        if (sel && typeof sel.selectionIndex === 'number') {
          chosen = group.data && group.data[sel.selectionIndex];
        } else {
          chosen = group.data && group.data.length ? group.data[0] : null;
        }
        if (chosen) {
          // 收集需要下载的 inputImageSrc
          if (chosen.shouldDownload) {
            downloadList.push(chosen.inputImageSrc || chosen.imageSrc || '');
          }
          // 如果选项包含 prompt 字段，则直接加入到 promptParts
          if (chosen.prompt && typeof chosen.prompt === 'string' && chosen.prompt.trim().length > 0) {
            promptParts.push(chosen.prompt.trim());
          } else if (chosen.name) {
            // 兜底：若没有 prompt，使用名称作为简短描述
            promptParts.push(chosen.name);
          }
        }
      });

      // 下载所需素材并附加到 formData
      for (let i = 0; i < downloadList.length; i++) {
        const fileId = downloadList[i];
        if (!fileId) continue;
        const { tempFilePath } = await wx.cloud.downloadFile({
          fileID: fileId,
        });
        formData.appendFile('image[]', tempFilePath);
      }

      // 最终 prompt：将所有选项的 promptParts 用分号连接
      if (promptParts.length > 0) {
        prompt = promptParts.join('；');
      } else {
        // 若没有任何自定义 prompt，则回退为简单风格说明
        prompt = '请按所选风格对图中墙面进行翻新与配色，保持空间结构不变。';
      }
    } else if (currentStyle === '玄武系列') {
      let colorPrompt = '';
      if (selectedProducts.length > 0) {
        // 使用选择的色卡颜色
        const selectedColors = selectedProducts.map(p => p.colorCode || p.name).join(' 或 ');
        colorPrompt = selectedColors;
      } else {
        // 组件可能不存在（未渲染），改为使用默认的 xuanwuCustomOptionList 第一项或名称作为回退
        const xuanwuGroup = this.data.xuanwuCustomOptionList && this.data.xuanwuCustomOptionList[0];
        const defaultOption = xuanwuGroup && xuanwuGroup.data && xuanwuGroup.data[0];
        if (defaultOption) {
          colorPrompt = defaultOption.color || defaultOption.name || '';
          selectedOptions.push({
            title: '颜色',
            content: defaultOption.name || colorPrompt,
          });
        } else {
          colorPrompt = '';
        }
      }
      prompt = `1.把图中这个空间墙面的孔洞，发霉等补平整，并使墙面颜色统一和均匀; 2. 然后把图中整体墙面改成 ${colorPrompt} 颜色 (不需要改地板和天花, 只是墙身); 3.保持图中建筑结构和布局不改变， 图片比例不改变`;
    } else {
      prompt = this.data.styleOptionsForInterior[this.data.value0].prompt;
    }

    this.progressInterval = setInterval(() => {
      if (this.data.progress < 99) {
        this.setData({ progress: this.data.progress + 1 });
      }
      if (!this.data.visible || this.data.generatedImageSrc) {
        clearInterval(this.progressInterval);
      }
    }, 1500);

    if (this.data.debugMode) {
      console.log(prompt);
      console.log(selectedOptions);
    }

    // Rever this for testing;
    // if (this.data.debugMode) {
    //   this.setData({ visible: false });
    //   return;
    // }

    formData.append('model', 'gpt-image-1');
    formData.append('prompt', prompt);
    formData.append('quality', this.data.debugMode ? 'low' : 'high');

    const data = formData.getData();
    this.requestTask = wx.request({
      url: 'https://ai.zsthinkgood.com/v1/images/edits',
      timeout: 240000,
      header: {
        'X-Client-Name': 'DIGITAL',
        'Content-Type': data.contentType,
      },
      method: 'POST',
      data: data.buffer,
      success: async (res) => {
        try {
          console.log(res);
          if (res.statusCode !== 200) {
            logger.info(res);
            throw new Error(res.statusCode);
          }
          const jsonResponse = res.data;
          const base64Json = jsonResponse.data[0].b64_json;
          const tempFileUrl = await saveBase64ToTempFile(base64Json);
          const imageSrc = await addWatermarkToImage(tempFileUrl);
          this.setData({
            generatedImageSrc: imageSrc,
            progress: 0,
            visible: false,
            resultImage: imageSrc,
            resultVisible: true,
            resultProducts: selectedProducts,
            resultStyle: currentStyle
          });

          // Save image locally
          saveUserHistoryLocally(tempFileUrl, prompt, selectedOptions);

          // 跳过更新用户积分（开发/调试阶段）
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

  tryGetUserInfo(phoneNumber) {
    try {
      fetchUserInfo(phoneNumber, true).then((userInfo) => {
        Message.success({
          context: this,
          offset: [90, 32],
          duration: 3000,
          content: '登陆成功',
        });
        this.setData({ loggedIn: true, userInfo, loginLoadingVisible: false });
      });
    } catch (e) {
      this.setData({ loginLoadingVisible: false });
      this.showErrorPopup();
    }
  },

  debugLogin() {
    this.tryGetUserInfo('19876036402');
  },

  verifyPhoneNumber(e) {
    this.setData({ loginLoadingVisible: true });
    wx.cloud
      .callFunction({
        // 云函数名称
        name: 'verifyphonenumber',
        // 传给云函数的参数
        data: {
          code: e.detail.code,
        },
      })
      .then((res) => {
        this.tryGetUserInfo(res.result.phoneNumber);
      })
      .catch((err) => {
        Message.error({
          context: this,
          offset: [90, 32],
          duration: 3000,
          content: '无法获取手机号, 请重试',
        });
        this.setData({ loginLoadingVisible: false });
        console.error(err);
      });
  },

  showNotEnoughCreditsMessage() {
    Message.warning({
      context: this,
      offset: [120, 32],
      duration: 3000,
      content: '积分已用完, 无法生成. ',
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

  onShow() {
    const userInfo = getLocalUserInfo();
    if (userInfo && userInfo.phoneNumber) {
      this.setData({ loggedIn: true, userInfo, loginLoadingVisible: false });
    }
  },

  onUnload() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
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

  paymentSuccessful() {
    console.log('支付成功...返回ing');
    setTimeout(() => {
      Message.success({
        context: this,
        offset: [145, 32],
        duration: 3000,
        content: '充值成功',
      });
    }, 500);
  },

  showExamplePicker() {
    this.setData({ examplePickerVisible: true });
  },

  applyShareTimelineReward() {
    if (!this.data.userInfo || !this.data.userInfo.phoneNumber) {
      return;
    }
    wx.cloud
      .callFunction({
        // 云函数名称
        name: 'shareontimeline',
        // 传给云函数的参数
        data: {
          type: 'SHARE_ON_TIMELINE',
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

  onShareTimeline() {
    this.setData({ sharedToTimeline: true });
    this.applyShareTimelineReward();
    return {
      title: `🔥数码彩AI🎨内外墙一键翻新👍接单神器免费用!`,
    };
  },

  onDoNothing() { },
});









