export default [
  // #if MP
  {
    icon: 'home',
    text: '首页',
    url: 'pages/home/home',
  },
  {
    icon: 'menu',
    text: '产品',
    url: 'pages/product/index',
  },
  {
    icon: 'table-1',
    text: '案例',
    url: 'pages/showcase/index',
  },
  {
    icon: 'city-1',
    text: '公司介绍',
    url: 'pages/aboutus/index',
  },
  {
    icon: 'radar',
    text: '探索',
    url: 'pages/explore/index',
  },
  // #elif IOS || ANDROID
  {
    icon: 'home',
    text: '首页',
    url: 'app-pages/home/home',
  },
  {
    icon: 'menu',
    text: '产品',
    url: 'app-pages/product/index',
  },
  {
    icon: 'table-1',
    text: '案例',
    url: 'app-pages/showcase/index',
  },
  {
    icon: 'city-1',
    text: '公司介绍',
    url: 'app-pages/aboutus/index',
  },
  {
    icon: 'radar',
    text: '探索',
    url: 'app-pages/explore/index',
  },
  // #endif

  // {
  //   icon: 'location',
  //   text: '联系我们',
  //   url: 'pages/contactus/index',
  // },
  // {
  //   icon: 'chart-3d',
  //   text: 'DIGITAL AI',
  //   url: 'pages/ai/index',
  // },
  // {
  //   icon: 'chart-3d',
  //   text: 'DIGITAL AR',
  //   url: 'pages/ar/index',
  // },
];
