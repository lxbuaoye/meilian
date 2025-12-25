// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  const bookingPhoneNumber = event.bookingPhoneNumber;
  const userPhoneNumber = event.userPhoneNumber;

  if (!openid) {
    return {
      success: false,
      message: '用户身份缺失',
    };
  }

  if (!bookingPhoneNumber || String(bookingPhoneNumber).length !== 11) {
    return {
      success: false,
      message: '请输入正确的手机号码',
    };
  }

  try {
    const existing = await db
      .collection('user_booking')
      .where({
        openid: openid,
      })
      .limit(1)
      .get();

    if (existing.data && existing.data.length > 0) {
      return {
        success: true,
        alreadySubmitted: true,
      };
    }

    await db.collection('user_booking').add({
      data: {
        openid: openid,
        userPhoneNumber: userPhoneNumber || '',
        bookingPhoneNumber: String(bookingPhoneNumber),
        createdAt: db.serverDate(),
      },
    });

    return {
      success: true,
      alreadySubmitted: false,
    };
  } catch (e) {
    console.error('saveuserbooking error', e);
    return {
      success: false,
      message: '服务器错误',
      error: e,
    };
  }
};
