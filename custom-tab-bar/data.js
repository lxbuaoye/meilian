export default [
  // #if MP
  {
    icon: '/image/bottom_navigation_bar/home_unselected.png',
    activeIcon: '/image/bottom_navigation_bar/home_selected.png',
    text: '首页',
    url: 'pages/home/home',
  },
  {
    icon: '/image/bottom_navigation_bar/color_card_unselected.png',
    activeIcon: '/image/bottom_navigation_bar/color_card_selected.png',
    text: '电子色卡',
    url: 'pages/product/index',
  },
  {
    icon: '/image/bottom_navigation_bar/icon-01-2.png',
    activeIcon: '/image/bottom_navigation_bar/icon-01.png',
    text: '预约到店',
    url: 'pages/location/index',
  },
  {
    icon: '/image/bottom_navigation_bar/my_meilian_unselected.png',
    activeIcon: '/image/bottom_navigation_bar/my_meilian_selected.png',
    text: '我的美联',
    url: 'pages/ai/profile/index',
  },
  // #endif
];
