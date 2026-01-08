// components/ai/example-picker/index.js
const app$ = typeof getApp === 'function' ? getApp() : {};
const appGlobal$ = app$.globalData || {};
const { CLOUD_STROAGE_PATH, CLOUD_IMAGE_BASE } = appGlobal$;

const buildingList = [
  [
    {
      name: '外墙1',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/example1.jpg`,
    },
    {
      name: '外墙2',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/example2.jpg`,
    },
    {
      name: '外墙3',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/example3.jpg`,
    },
    {
      name: '外墙4',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/example4.jpg`,
    },
  ],
  [
    {
      name: '内墙1',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/in_example1.jpg`,
    },
    {
      name: '内墙2',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/in_example2.jpg`,
    },
    {
      name: '内墙3',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/in_example3.jpg`,
    },
    {
      name: '内墙4',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/in_example4.jpg`,
    },
  ],
];

const diagnosisList = [
  [
    {
      name: '外墙1',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/example1.jpg`,
    },
    {
      name: '外墙2',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/example2.jpg`,
    },
    {
      name: '内墙1',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/in_example1.jpg`,
    },
    {
      name: '内墙2',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/in_example2.jpg`,
    },
  ],
];

const furnitureList = [
  [
    {
      name: '家具1',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/furniture_example1.jpg`,
    },
    {
      name: '家具2',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/furniture_example2.jpg`,
    },
  ],
];

const bathroomList = [
  [
    {
      name: '浴室1',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/bathroom_example1.jpg`,
    },
    {
      name: '浴室2',
      imageSrc: `${CLOUD_IMAGE_BASE}/resources/ai/example/bathroom_example2.jpg`,
    },
  ],
];

function getList(exampleType) {
  if (exampleType === 'BUILDING') {
    return buildingList;
  }
  if (exampleType === 'DIAGNOSIS') {
    return diagnosisList;
  }
  if (exampleType === 'FURNITURE') {
    return furnitureList;
  }
  if (exampleType === 'BATHROOM') {
    return bathroomList;
  }
  return buildingList;
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    useCustomNavBar: {
      type: Boolean,
      value: false,
    },
    tabValue: {
      type: Number,
      value: 0,
    },
    visible: {
      type: Boolean,
      value: false,
    },
    exampleType: {
      type: String,
      value: 'BUILDING',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    loadingIndex: -1,
    list: [],
  },

  lifetimes: {
    attached() {
      this.setData({ list: getList(this.data.exampleType) });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onVisibleChange(e) {
      this.setData({
        visible: e.detail.visible,
      });
    },
    async selectImage(e) {
      if (this.data.loadingIndex > 0) {
        return;
      }
      this.setData({ loadingIndex: e.currentTarget.dataset.index });
      const imageSrc = this.data.list[this.data.tabValue][e.currentTarget.dataset.index].imageSrc;

      if (!imageSrc) {
        console.error('图片路径为空');
        this.setData({ loadingIndex: -1 });
        return;
      }

      let tempFilePath;
      try {
        // 判断链接类型并下载
        if (imageSrc.startsWith('cloud://')) {
          const res = await wx.cloud.downloadFile({ fileID: imageSrc });
          tempFilePath = res.tempFilePath;
        } else if (imageSrc.startsWith('http') || imageSrc.startsWith('https')) {
          const res = await new Promise((resolve, reject) => {
            wx.downloadFile({
              url: imageSrc,
              success: resolve,
              fail: reject,
            });
          });
          tempFilePath = res.tempFilePath;
        } else {
          // 本地路径或其他情况
          tempFilePath = imageSrc;
        }

        this.triggerEvent('selectexampleimage', {
          data: {
            imageSrc: tempFilePath,
          },
        });
      } catch (error) {
        console.error('下载示例图片失败:', error);
        wx.showToast({
          title: '图片下载失败',
          icon: 'none'
        });
      }

      // 隐藏弹窗
      this.setData({
        loadingIndex: -1,
        visible: false,
      });
    },
  },
});
