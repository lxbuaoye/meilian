Component({
  properties: {
    // 监听的数字属性，只处理整数
    value: {
      type: Number,
      value: 0, // 默认值
      observer: 'startAnimation', // 当 value 属性变化时，触发动画
    },
  },

  data: {
    displayNumber: '0', // 实际显示在界面上的数字字符串
    _currentValue: 0, // 动画过程中内部维护的当前数值
    _timer: null, // 定时器句柄
    _isFirstLoad: true, // 标记是否是组件首次加载
  },

  lifetimes: {
    attached() {
      // 组件挂载时，初始化显示为 value 的值
      // 首次加载，直接显示，不触发动画
      this.setData({
        displayNumber: String(this.properties.value),
        _currentValue: this.properties.value,
        _isFirstLoad: true, // 确保标志为 true
      });
    },
    detached() {
      // 组件卸载时，清理定时器
      this._clearAnimation();
    },
  },

  methods: {
    /**
     * 启动数字增长动画
     * 由 value 属性的 observer 自动调用
     * @param {number} newVal - value 属性的新值
     * @param {number} oldVal - value 属性的旧值
     */
    startAnimation: function (newVal, oldVal) {
      // --- 核心改动开始 ---
      // 如果是首次加载（_isFirstLoad为true），则只更新_currentValue并将其设置为false，不执行动画
      if (this.data._isFirstLoad) {
        // 第一次observer触发（通常发生在attached之后），只更新内部值，不动画
        this.setData({
          _currentValue: newVal,
          _isFirstLoad: false, // 标记为非首次加载
        });
        // 确保 display 值在第一次加载时被正确更新，即使没有动画
        this.setData({
          displayNumber: String(newVal),
        });
        return;
      }
      // --- 核心改动结束 ---

      // 如果新旧值相同，则不执行动画
      if (newVal === oldVal) {
        return;
      }

      this._clearAnimation(); // 每次启动新动画前，先清理旧的定时器

      // 默认动画参数（内置，不对外暴露）
      const duration = 1500; // 动画总时长（毫秒）
      const interval = 16; // 更新间隔（毫秒，约等于一帧）

      const startNum = oldVal; // 动画的起始值就是上一次的值
      const targetNum = newVal; // 动画的目标值就是新传入的值

      const range = targetNum - startNum; // 数字变化的范围
      const steps = duration / interval; // 动画步数
      const increment = range / steps; // 每一步的增量

      const startTime = Date.now(); // 记录动画开始时间

      // 立即更新显示数字为起始值，确保动画从正确的地方开始
      this.setData({
        displayNumber: String(Math.round(startNum)), // 确保初始显示为整数
        _currentValue: startNum,
      });

      this.data._timer = setInterval(() => {
        const elapsed = Date.now() - startTime; // 已经过去的时间

        if (elapsed >= duration) {
          // 动画时间结束，直接设置为目标值并停止
          this.setData({
            displayNumber: String(targetNum), // 确保最终显示为整数
            _currentValue: targetNum,
          });
          this._clearAnimation();
          this.triggerEvent('animated', { value: targetNum }); // 动画完成事件
          return;
        }

        // 根据已过时间计算当前应该达到的值（线性插值）
        const currentValue = startNum + (elapsed / duration) * range;

        // 更新显示数字，取整确保是整数
        this.setData({
          displayNumber: String(Math.round(currentValue)),
          _currentValue: currentValue, // 实时更新内部值
        });
      }, interval);
    },

    /**
     * 清理定时器
     */
    _clearAnimation: function () {
      if (this.data._timer) {
        clearInterval(this.data._timer);
        this.data._timer = null;
      }
    },
  },
});
