export default [
  // #if MP
  {
    icon: '/image/底部导航栏/首页未选中.png',
    activeIcon: '/image/底部导航栏/首页已选中.png',
    text: '首页',
    url: 'pages/home/home',
  },
  {
    icon: '/image/底部导航栏/电子色卡未选中.png',
    activeIcon: '/image/底部导航栏/电子色卡已选中.png',
    text: '电子色卡',
    url: 'pages/product/index',
  },
  {
    icon: '/image/底部导航栏/预约到店.png',
    text: '预约到店',
    url: 'pages/location/index',
    isSpecial: true, // 标记为特殊按钮（中间按钮）
  },
  {
    icon: '/image/底部导航栏/美联商城未选中.png',
    activeIcon: '/image/底部导航栏/美联商城未选中.png', // 暂时使用同一张未选中图片
    text: '美联商城',
    url: 'pages/mall/index', // 占位页面
    isPlaceholder: true,
  },
  {
    icon: '/image/底部导航栏/我的美联未选中.png',
    activeIcon: '/image/底部导航栏/我的美联已选中.png',
    text: '我的美联',
    url: 'pages/ai/profile/index',
  },
  // #endif
];
