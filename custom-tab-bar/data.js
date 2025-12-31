// 底部导航栏使用HTTPS URL，确保在所有环境下都能正常加载
const IMAGE_BASE_URL = 'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la';

export default [
  // #if MP
  {
    icon: `${IMAGE_BASE_URL}/image/common/home_unselected.png`,
    activeIcon: `${IMAGE_BASE_URL}/image/common/home_selected.png`,
    text: '首页',
    url: 'pages/home/home',
  },
  {
    icon: `${IMAGE_BASE_URL}/image/common/color_card_unselected.png`,
    activeIcon: `${IMAGE_BASE_URL}/image/common/color_card_selected.png`,
    text: '电子色卡',
    url: 'pages/color-card/index',
  },
  {
    // 中间大椭圆按钮，使用本地资源作为参考图，文本会在渲染层覆盖以显示“探索更多”
    icon: `${IMAGE_BASE_URL}/image/common/explore more1.png`,
    activeIcon: `${IMAGE_BASE_URL}/image/common/explore more.png`,
    text: '探索更多',
    url: 'pages/product/index',
    isMiddle: true,
  },
  {
    icon: `${IMAGE_BASE_URL}/image/common/icon-01-2.png`,
    activeIcon: `${IMAGE_BASE_URL}/image/common/icon-01.png`,
    text: '预约到店',
    url: 'pages/location/index',
  },
  {
    icon: `${IMAGE_BASE_URL}/image/common/my_meilian_unselected.png`,
    activeIcon: `${IMAGE_BASE_URL}/image/common/my_meilian_selected.png`,
    text: '我的美联',
    url: 'pages/ai/profile/index',
  },
  // #endif
];
