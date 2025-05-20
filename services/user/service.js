export function updateUserInfo(userInfo) {
  // Save to StorageSync
  wx.setStorageSync('userInfo', userInfo);
  const app = getApp();
  app.globalData.userInfo = userInfo;
}

export async function fetchUserInfo(phoneNumber) {
  return wx.cloud.callFunction({
    // 云函数名称
    name: 'getuserinfo',
    // 传给云函数的参数
    data: {
      phoneNumber: phoneNumber,
    },
  });
}
