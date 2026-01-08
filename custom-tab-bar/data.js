// 底部导航栏使用本地静态资源，确保加载速度和稳定性

export default [
  // #if MP
  {
    icon: "/components/icon/homeu.png",
    activeIcon:"/components/icon/home.png",
    text: '首页',
    url: 'pages/home/home',
  },
  {
    icon: "/components/icon/yyddu.png",
    activeIcon: "/components/icon/yydd.png",
    text: '美联服务',
    url: 'pages/location/index',
  },
  {
    icon: "/components/icon/wdmlu.png",
    activeIcon: "/components/icon/wdml.png",
    text: '关于美联',
    url: 'pages/ai/profile/index',
  },
  {
    // 中间大椭圆按钮，使用本地资源作为参考图，文本会在渲染层覆盖以显示"探索更多"
    icon: "/components/icon/tsgdu.png",
    activeIcon: "/components/icon/tsgd.png",
    text: '探索更多',
    url: 'pages/product/index',
    isMiddle: true,
  },
  // #endif
];
