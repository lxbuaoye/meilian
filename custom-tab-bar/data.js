// 底部导航栏使用HTTPS URL，确保在所有环境下都能正常加载
const IMAGE_BASE_URL = 'https://636c-cloud1-9gz59mfw7610d03f-1392076473.tcb.qcloud.la';

// 获取缓存的图标路径，如果没有缓存则使用原始URL
function getCachedIcon(url) {
  const app = getApp();
  const iconCache = app && app.globalData && app.globalData.tabIconCache;
  return iconCache && iconCache[url] ? iconCache[url] : url;
}

export default [
  // #if MP
  {
    icon: "/components/icon/homeu.png",
    activeIcon:"/components/icon/home.png",
    text: '首页',
    url: 'pages/home/home',
  },
  {
    icon: "/components/icon/dzsku.png",
    activeIcon: "/components/icon/dzsk.png",
    text: '电子色卡',
    url: 'pages/color-card/index',
  },
  {
    // 中间大椭圆按钮，使用本地资源作为参考图，文本会在渲染层覆盖以显示"探索更多"
    icon: "/components/icon/tsgdu.png",
    activeIcon: "/components/icon/tsgd.png",
    text: '探索更多',
    url: 'pages/product/index',
    isMiddle: true,
  },
  {
    icon: "/components/icon/yyddu.png",
    activeIcon: "/components/icon/yydd.png",
    text: '预约到店',
    url: 'pages/location/index',
  },
  {
    icon: "/components/icon/wdmlu.png",
    activeIcon: "/components/icon/wdml.png",
    text: '企业介绍',
    url: 'pages/ai/profile/index',
  },
  // #endif
];
