Component({
  properties: {
    // 定义组件的属性，可以在使用时传入
    iconPath: {
      type: String,
      value: '/images/loading.gif', // 默认值
    },
    tips: {
      type: Array,
      value: [
        '正在为你的家具施加魔法',
        '正在为你调配专属色彩',
        '你的家具即将换上新衣',
        'AI 正在精准地涂抹每一个像素',
        '灵感正在加载中，你的创意马上变为现实',
        '你的家具正在换装成您挑选的颜色',
        '正在处理你的“家具改色”计划',
      ],
    },
    interval: {
      type: Number,
      value: 3000, // 切换间隔，默认为3秒
    },
  },

  data: {
    currentTipIndex: 0,
    currentTip: '',
    tipAnimation: '',
    timer: null,
  },

  // 生命周期方法，组件挂载时执行
  attached() {
    this.startTipsSwitch();
  },

  // 生命周期方法，组件卸载时执行
  detached() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  methods: {
    startTipsSwitch: function () {
      const { tips, interval } = this.properties;

      // 初始显示第一个 tips
      this.setData({
        currentTip: tips[this.data.currentTipIndex],
        tipAnimation: 'fade-in-out-enter',
      });

      const timer = setInterval(() => {
        this.setData({
          tipAnimation: 'fade-in-out-leave',
        });

        setTimeout(() => {
          const nextIndex = (this.data.currentTipIndex + 1) % tips.length;
          this.setData({
            currentTipIndex: nextIndex,
            currentTip: tips[nextIndex],
            tipAnimation: 'fade-in-out-enter',
          });
        }, 500); // 这里的 500ms 和 CSS 动画时间一致
      }, interval);

      this.setData({
        timer: timer,
      });
    },
  },
});
