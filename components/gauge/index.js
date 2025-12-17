// components/gauge/gauge.js
Component({
  properties: {
    value: { type: Number, value: 0 },
    maxValue: { type: Number, value: 100 },
    label: { type: String, value: '评分' },
  },
  data: {
    canvasId: '',
    canvasSize: 200, // 默认值，会被实际测量值覆盖
    valueColor: '#FF4B3A',
    displayValue: 0,
  },

  observers: {
    'value, maxValue': function (value, maxValue) {
      if (this.data.canvasId) {
        this._animateGauge(value, maxValue);
      }
    },
  },

  lifetimes: {
    attached() {
      const canvasId = `gaugeCanvas-${Date.now()}${Math.floor(Math.random() * 1000)}`;
      this.setData({ canvasId });

      // 延迟执行，等待布局完成以便获取准确宽度
      setTimeout(() => {
        this._initCanvasSizeAndDraw();
      }, 100);
    },
  },

  methods: {
    _initCanvasSizeAndDraw() {
      const query = wx.createSelectorQuery().in(this);
      query
        .select('.canvas-wrapper')
        .boundingClientRect((rect) => {
          if (rect && rect.width > 0) {
            // 获取容器真实宽度，并取偶数
            const size = Math.floor(rect.width) % 2 === 0 ? Math.floor(rect.width) : Math.floor(rect.width) - 1;

            this.setData({ canvasSize: size }, () => {
              console.log(`[Gauge] 自适应宽度: ${size}px`);
              this._animateGauge(this.data.value, this.data.maxValue);
            });
          } else {
            // 降级处理
            this.setData({ canvasSize: 200 }, () => {
              this._animateGauge(this.data.value, this.data.maxValue);
            });
          }
        })
        .exec();
    },

    _animateGauge(targetValue, maxValue) {
      const that = this;
      const startValue = 0;
      const duration = 1000;
      const startTime = Date.now();

      const tick = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        let progress = elapsed / duration;
        if (progress > 1) progress = 1;

        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (targetValue - startValue) * easeProgress;

        that.setData({ displayValue: Math.round(currentValue) });
        that._drawFrame(currentValue, maxValue);

        if (progress < 1) {
          setTimeout(tick, 16);
        }
      };
      tick();
    },

    _drawFrame(currentValue, maxValue) {
      const ctx = wx.createCanvasContext(this.data.canvasId, this);
      const size = this.data.canvasSize;
      const lineWidth = 12;

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - lineWidth / 2;

      ctx.clearRect(0, 0, size, size);
      ctx.translate(centerX, centerY);

      const percentage = Math.min(100, Math.max(0, (currentValue / maxValue) * 100));
      const startAngle = Math.PI;
      const fullEndAngle = 2 * Math.PI;
      const currentEndAngle = startAngle + (percentage / 100) * Math.PI;

      let startColor;
      let endColor;
      let textColor;
      if (percentage >= 50) {
        startColor = '#FFD400';
        endColor = '#4CD964';
        textColor = '#10B981';
      } else {
        startColor = '#FF9500';
        endColor = '#FF4B3A';
        textColor = '#FF4B3A';
      }

      const gradient = ctx.createLinearGradient(-radius, 0, radius, 0);
      gradient.addColorStop(0, startColor);
      gradient.addColorStop(1, endColor);

      // 1. 绘制背景
      ctx.beginPath();
      ctx.arc(0, 0, radius, startAngle, fullEndAngle, false);
      ctx.setStrokeStyle('#F5F5F5');
      ctx.setLineWidth(lineWidth);
      ctx.setLineCap('round');
      ctx.stroke();

      // 2. 绘制进度
      if (percentage > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, startAngle, currentEndAngle, false);
        ctx.setStrokeStyle(gradient);
        ctx.setLineWidth(lineWidth);
        ctx.setLineCap('round');
        ctx.stroke();
      }

      ctx.draw();
    },
  },
});
