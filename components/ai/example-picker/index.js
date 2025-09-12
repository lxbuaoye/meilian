// components/ai/example-picker/index.js
const { CLOUD_STROAGE_PATH } = getApp().globalData;

const buildingList = [
  [
    {
      name: '外墙1',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/example1.jpg`,
    },
    {
      name: '外墙2',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/example2.jpg`,
    },
    {
      name: '外墙3',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/example3.jpg`,
    },
    {
      name: '外墙4',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/example4.jpg`,
    },
  ],
  [
    {
      name: '内墙1',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/in_example1.jpg`,
    },
    {
      name: '内墙2',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/in_example2.jpg`,
    },
    {
      name: '内墙3',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/in_example3.jpg`,
    },
    {
      name: '内墙4',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/in_example4.jpg`,
    },
  ],
];

const diagnosisList = [
  [
    {
      name: '外墙1',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/example1.jpg`,
    },
    {
      name: '外墙2',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/example2.jpg`,
    },
    {
      name: '内墙1',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/in_example1.jpg`,
    },
    {
      name: '内墙2',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/in_example2.jpg`,
    },
  ],
];

const furnitureList = [
  [
    {
      name: '家具1',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/furniture_example1.jpg`,
    },
    {
      name: '家具2',
      imageSrc: `${CLOUD_STROAGE_PATH}/resources/ai/example/furniture_example2.jpg`,
    },
  ],
];

function getList(exampleType) {
  console.log(exampleType);
  if (exampleType === 'BUILDING') {
    return buildingList;
  }
  if (exampleType === 'DIAGNOSIS') {
    return diagnosisList;
  }
  if (exampleType === 'FURNITURE') {
    return furnitureList;
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
      const { tempFilePath } = await wx.cloud.downloadFile({
        fileID: this.data.list[this.data.tabValue][e.currentTarget.dataset.index].imageSrc,
      });
      this.triggerEvent('selectexampleimage', {
        data: {
          imageSrc: tempFilePath,
        },
      });
      // 隐藏弹窗
      this.setData({
        loadingIndex: -1,
        visible: false,
      });
    },
  },
});
