// pages/location/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuBarTop: 44,
    menuBarHeight: 32,
    phoneNumber: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const menuButton = wx.getMenuButtonBoundingClientRect();
    this.setData({
      menuBarTop: menuButton.top,
      menuBarHeight: menuButton.height,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (this.getTabBar && typeof this.getTabBar === 'function') {
      const tabBar = this.getTabBar();
      if (tabBar && typeof tabBar.init === 'function') {
        tabBar.init();
      }
    }
  },

  /**
   * 电话号码输入
   */
  onPhoneInput(e) {
    this.setData({
      phoneNumber: e.detail.value,
    });
  },

  /**
   * 立即预约
   */
  onBookNow() {
    const { phoneNumber } = this.data;
    if (!phoneNumber || phoneNumber.length !== 11) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
      });
      return;
    }

    // TODO: 调用预约接口
    wx.showToast({
      title: '预约成功',
      icon: 'success',
    });
    
    // 清空输入
    this.setData({
      phoneNumber: '',
    });
  },

  /**
   * 在线客服
   */
  onOnlineService() {
    // TODO: 打开在线客服
    wx.showToast({
      title: '正在连接客服...',
      icon: 'none',
    });
  },

  /**
   * 电话咨询
   */
  onPhoneConsult() {
    wx.makePhoneCall({
      phoneNumber: '400-080-1633',
      fail: (err) => {
        console.error('拨打电话失败', err);
        wx.showToast({
          title: '拨打电话失败',
          icon: 'none',
        });
      },
    });
  },
});
