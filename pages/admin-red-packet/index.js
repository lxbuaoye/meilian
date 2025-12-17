import Toast from 'tdesign-miniprogram/toast/index';
import { createPageWebSocketService } from '../../services/socket/util'; // 导入模块
const db = wx.cloud.database();
const _ = db.command;

// 辅助函数：将数字格式化为两位数
const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

// 辅助函数：格式化日期对象
function formatDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`;
}

const STATUS = {
  ACTIVE: 'ACTIVE', // 发放中
  PENDGING: 'PENDING', // 已停止
  STOPPED: 'STOPPED',
};

Page({
  data: {
    serverConnecting: true,
    redPackets: [],
  },

  onLoad(options) {
    this._webSocketService = createPageWebSocketService();

    // 3. 连接 WebSocket
    this._webSocketService.connect();
    this._webSocketService.onOpen(() => {
      this.setData({ serverConnecting: false });
    });
    // 2. 注册当前页面专属的 WebSocket 事件监听器

    this.loadRedPackets();
  },

  async loadRedPackets() {
    const now = new Date().getTime();
    const { data } = await db
      .collection('red_packet')
      .where({
        status: _.or(['ACTIVE', 'PENDING', 'STOPPED']),
        startTime: _.lt(now),
        originalEndTime: _.gt(now),
      })
      .get();
    console.log(data);
    this.setData({
      redPackets: data.map((item) => {
        return { ...item, displayEndTime: formatDate(new Date(item.endTime)) };
      }),
    });
  },

  getEndTime() {
    const now = new Date();

    // 获取当前时间的毫秒数
    const currentTimeInMilliseconds = now.getTime();

    // 增加 10 分钟的毫秒数
    const tenMinutesInMilliseconds = 10 * 60 * 1000;

    // 计算新时间的毫秒数
    const newTimeInMilliseconds = currentTimeInMilliseconds + tenMinutesInMilliseconds;

    // 使用新的毫秒数创建一个新的 Date 对象
    const newDate = new Date(newTimeInMilliseconds);
    return newDate;
  },

  triggerServerMessage() {
    this._webSocketService.send(
      JSON.stringify({
        type: 'RED_PACKET_STATUS_CHANGE',
        description: 'Check Red packet status get changed.',
      }),
    );
  },

  // 处理“发放”按钮点击事件
  async handleIssue(e) {
    // 获取点击按钮时传递过来的红包ID
    const idToUpdate = e.currentTarget.dataset.id;
    console.log(idToUpdate);
    const newEndTime = this.getEndTime();
    const res = await db
      .collection('red_packet')
      .doc(idToUpdate)
      .update({
        data: {
          endTime: newEndTime.getTime(),
          status: 'ACTIVE',
        },
      });
    console.log(res);
    if (res.stats.updated !== 1) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '发放失败...',
        theme: 'error',
        direction: 'column',
      });
      return;
    }
    this.triggerServerMessage();
    // 更新指定ID的红包状态为“发放中”
    await this.loadRedPackets();

    console.log(`红包 ID ${idToUpdate} 已发放`);
  },

  // 处理“停止”按钮点击事件
  async handleStop(e) {
    // 获取点击按钮时传递过来的红包ID
    const idToUpdate = e.currentTarget.dataset.id;

    const res = await db
      .collection('red_packet')
      .doc(idToUpdate)
      .update({
        data: {
          status: 'STOPPED',
        },
      });
    console.log(res);

    if (res.stats.updated !== 1) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '停止失败...',
        theme: 'error',
        direction: 'column',
      });
      return;
    }

    this.triggerServerMessage();
    await this.loadRedPackets();

    console.log(`红包 ID ${idToUpdate} 已停止`);
  },
});
