// utils/page_websocket.js

const WS_URL = 'wss://ws.zsthinkgood.com/'; // 替换为你的 WSS 服务器地址

// const WS_URL = 'wss://localhost:8080'; // 替换为你的 WSS 服务器地址

/**
 * 创建并返回一个管理单个WebSocket连接的服务实例
 * 每个实例管理自己的连接和回调
 */
export function createPageWebSocketService() {
  let socketTask = null;
  let isConnected = false;

  // 存储特定于此实例的回调
  const messageCallbacks = new Set();
  const openCallbacks = new Set();
  const closeCallbacks = new Set();
  const errorCallbacks = new Set();

  function initWebSocketInstance() {
    socketTask = wx.connectSocket({
      url: WS_URL,
      success: (res) => {
        console.log('[PageWS] wx.connectSocket 调用成功', res);
      },
      fail: (err) => {
        console.error('[PageWS] wx.connectSocket 调用失败', err);
      },
    });

    if (!socketTask) {
      console.error('[PageWS] 无法创建 WebSocket 实例！');
      return;
    }

    socketTask.onOpen((res) => {
      console.log('[PageWS] WebSocket 连接已打开！');
      isConnected = true;
      openCallbacks.forEach((cb) => cb(res));
    });

    socketTask.onMessage((res) => {
      console.log('[PageWS] 收到服务器消息：', res.data);
      messageCallbacks.forEach((cb) => cb(res.data));
    });

    socketTask.onClose((res) => {
      console.log('[PageWS] WebSocket 已关闭！', res);
      isConnected = false;
      socketTask = null; // 清除实例
      closeCallbacks.forEach((cb) => cb(res));
    });

    socketTask.onError((res) => {
      console.error('[PageWS] WebSocket 连接错误！', res);
      isConnected = false;
      socketTask = null; // 清除实例
      errorCallbacks.forEach((cb) => cb(res));
    });
  }

  return {
    /**
     * 连接 WebSocket
     */
    connect() {
      if (!isConnected && !socketTask) {
        console.log('[PageWS] 尝试连接 WebSocket...');
        initWebSocketInstance();
      } else {
        console.log('[PageWS] WebSocket 已连接或正在连接中。');
      }
    },

    /**
     * 发送消息
     * @param {string | object} data 要发送的数据，如果是对象会自动转为JSON字符串
     */
    send(data) {
      if (!isConnected || !socketTask) {
        console.warn('[PageWS] WebSocket 未连接，无法发送消息。');
        wx.showToast({ title: 'WebSocket 未连接', icon: 'none' });
        return;
      }

      const sendData = typeof data === 'object' ? JSON.stringify(data) : String(data);

      socketTask.send({
        data: sendData,
        success: () => {
          console.log('[PageWS] 消息发送成功:', sendData);
        },
        fail: (err) => {
          console.error('[PageWS] 消息发送失败:', err);
          wx.showToast({ title: '消息发送失败', icon: 'error' });
        },
      });
    },

    /**
     * 关闭 WebSocket 连接
     */
    close() {
      if (isConnected && socketTask) {
        socketTask.close({
          success: (res) => {
            console.log('[PageWS] wx.closeSocket 调用成功', res);
          },
          fail: (err) => {
            console.error('[PageWS] wx.closeSocket 调用失败', err);
          },
        });
      } else {
        console.warn('[PageWS] WebSocket 已关闭或未连接。');
      }
    },

    /**
     * 注册消息监听回调
     * @param {function} callback
     */
    onMessage(callback) {
      if (typeof callback === 'function') {
        messageCallbacks.add(callback);
      }
    },

    /**
     * 移除消息监听回调
     * @param {function} callback
     */
    offMessage(callback) {
      messageCallbacks.delete(callback);
    },

    /**
     * 注册连接打开回调
     * @param {function} callback
     */
    onOpen(callback) {
      if (typeof callback === 'function') {
        openCallbacks.add(callback);
      }
    },
    offOpen(callback) {
      openCallbacks.delete(callback);
    },

    /**
     * 注册连接关闭回调
     * @param {function} callback
     */
    onClose(callback) {
      if (typeof callback === 'function') {
        closeCallbacks.add(callback);
      }
    },
    offClose(callback) {
      closeCallbacks.delete(callback);
    },

    /**
     * 注册连接错误回调
     * @param {function} callback
     */
    onError(callback) {
      if (typeof callback === 'function') {
        errorCallbacks.add(callback);
      }
    },
    offError(callback) {
      errorCallbacks.delete(callback);
    },

    /**
     * 获取当前连接状态
     * @returns {boolean}
     */
    getConnectStatus() {
      return isConnected;
    },
  };
}
