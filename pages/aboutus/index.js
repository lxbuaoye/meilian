const landscape = [
  'https://img1.baidu.com/it/u=682342695,202492647&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281',
  'https://img2.baidu.com/it/u=2434201168,269190915&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
  'https://img1.baidu.com/it/u=1927287361,1667152263&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500',
  'https://img0.baidu.com/it/u=788044902,85816046&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800',
];

const advantageList = [
  {
    imageSrc: './resources/0.png',
    title: '数码彩仿大理石漆',
    subtitle: '浑然天成 · 效果逼真',
  },
  {
    imageSrc: './resources/1.png',
    title: '艺术 · 墙漆',
    subtitle: '艺术漆的效果，乳胶漆的价格',
  },
  {
    imageSrc: './resources/2.png',
    title: '专业产品+工艺',
    subtitle: '出色效果，由您演绎，十大家装漆涂装效果',
  },
  {
    imageSrc: './resources/3.png',
    title: '省工 + 省时 = 省钱',
    subtitle: '直接在水泥/瓷砖/马赛克上涂刷',
  },
  {
    imageSrc: './resources/4.png',
    title: '从新项目全屋翻新',
    subtitle: '家里所有的东西，都能全部翻新',
  },
  {
    imageSrc: './resources/5.png',
    title: '全屋防水解决方案',
    subtitle: '新家防水一刷用不漏，旧家补漏即刷即修复',
  },
  {
    imageSrc: './resources/6.png',
    title: '家居环保基装一体化',
    subtitle: '提供全面专业的辅助材料',
  },
];

Page({
  data: {
    landscape,
    advantageList,
  },
  onLoad(options) {},
  onShow() {
    this.getTabBar().init();
  },
  onShareAppMessage() {},
});
