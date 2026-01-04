const { CLOUD_STROAGE_PATH } = getApp().globalData;

export const customOptionList = [
  {
    header: '家具',
    height: 124,
    width: 124,
    innerPadding: 0,
    outterPadding: 10,
    data: [
      {
        name: '椅子',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/furniture-ai/chair.png`,
        prompt: '1.把图2的底色做成图3颜色，保留图2中的纹理和质感不变 2.把图2效果应用在图1墙面3.图1除墙面效果，其它不变',
      },
      {
        name: '桌子',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/furniture-ai/desk.png`,
        prompt: '1.把图2的底色做成图3颜色，保留图2中的纹理和质感不变 2.把图2效果应用在图1墙面3.图1除墙面效果，其它不变',
      },
      {
        name: '柜子',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/furniture-ai/cabinet.png`,
        prompt: '1.把图2的底色做成图3颜色，保留图2中的纹理和质感不变 2.把图2效果应用在图1墙面3.图1除墙面效果，其它不变',
      },
      {
        name: '门',
        imageSrc: `${CLOUD_STROAGE_PATH}/resources/furniture-ai/door.png`,
        prompt: '1.把图2的底色做成图3颜色，保留图2中的纹理和质感不变 2.把图2效果应用在图1墙面3.图1除墙面效果，其它不变',
      },
    ],
  },
  {
    header: '颜色',
    height: 104,
    width: 180,
    innerPadding: 0,
    outterPadding: 10,
    data: [
      {
        category: 'CBCC',
        name: '钟乳石',
        colorCode: 'XW-10',
        color: 'rgb(225, 223, 207)',
      },
      {
        category: 'CBCC',
        name: '玉瓶',
        colorCode: 'XW-09',
        color: 'rgb(228, 222, 210)',
      },
      {
        category: 'CBCC',
        name: '千山翠',
        colorCode: 'XW-05',
        color: 'rgb(117, 131, 113)',
      },
      {
        category: 'CBCC',
        name: '福祉',
        colorCode: 'XW-02',
        color: 'rgb(107, 52, 47)',
      },
      {
        category: 'CBCC',
        name: '银鱼',
        colorCode: 'XW-08',
        color: 'rgb(200, 202, 199)',
      },
    ],
  },
];
