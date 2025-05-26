export function getLocalUserInfo() {
  const app = getApp();
  return app.globalData.userInfo;
}

export async function clearUserInfo() {
  getApp().globalData.userInfo = {};
  wx.removeStorageSync('userInfo');
}

export async function syncUserInfo(userInfo) {
  if (!userInfo || !userInfo.phoneNumber) {
    return;
  }
  wx.setStorageSync('userInfo', userInfo);
  const app = getApp();
  app.globalData.userInfo = userInfo;
  return userInfo;
}

export async function fetchUserInfo(phoneNumber) {
  return new Promise((resolve, reject) => {
    wx.cloud
      .callFunction({
        // 云函数名称
        name: 'getuserinfo',
        // 传给云函数的参数
        data: {
          phoneNumber: phoneNumber,
        },
      })
      .then((res) => {
        console.log(res);
        const userInfo = res.result;
        // Make sure data is valid
        if (userInfo.phoneNumber) {
          syncUserInfo(userInfo);
          resolve(userInfo);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}
