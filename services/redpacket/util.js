import { getLocalUserInfo } from '../user/service';
const { CLOUD_STROAGE_PATH } = getApp().globalData;

const accountInfo = wx.getAccountInfoSync();
const { envVersion } = accountInfo.miniProgram;
const db = wx.cloud.database();
const _ = db.command;

export const fetchRedPacket = async () => {
  const now = new Date().getTime();
  const { data } = await db
    .collection('red_packet')
    .where({
      status: _.eq('ACTIVE'),
      startTime: _.lt(now),
      endTime: _.gt(now),
    })
    .orderBy('startTime', 'desc')
    .limit(1)
    .get();
  if (data.length > 0) {
    // Make sure user haven't claim this red packet
    const userInfo = getLocalUserInfo();
    if (userInfo && userInfo.phoneNumber) {
      const { _id } = data[0];
      // Bypass testing red packet
      if (data[0].testingOnly && envVersion === 'release') {
        return;
      }
      const res2 = await db
        .collection('user_red_packet')
        .where({
          campaignId: _.eq(_id),
          user: _.eq(userInfo.phoneNumber),
        })
        .count();
      if (res2.total > 0) {
        return null;
      }
    }
    return data[0];
  }
  return null;
};
