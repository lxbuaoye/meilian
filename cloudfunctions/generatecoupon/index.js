// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();
const _ = db.command;

function generateRandomCodesWithCredit(prefix, count, creditValue) {
  // 定义允许的字符集：数字1-9，以及不含I, L, O的大写字母
  const allowedChars = '123456789ABCDEFGHJKMNPQRSTUVWXY';

  const codesAndCredits = []; // 用于存储生成的对象数组
  const codeLength = 6; // 每个随机部分的长度固定为8位
  const allowedCharsLength = allowedChars.length;

  // --- 参数验证 ---
  if (typeof prefix !== 'string' || prefix.length === 0) {
    console.error('错误：前缀(prefix)必须是非空字符串。');
    return [];
  }
  if (typeof count !== 'number' || count <= 0 || !Number.isInteger(count)) {
    console.error('错误：数量(count)必须是大于0的整数。');
    return [];
  }
  // 可以根据creditValue的预期类型进行更多验证，这里只做基本判断
  // if (creditValue === undefined || creditValue === null) {
  //   console.warn("警告：信用值(creditValue)未提供或为null。");
  // }
  // --- 参数验证结束 ---

  for (let i = 0; i < count; i++) {
    let randomString = '';
    // 生成codeLength位随机字符串
    for (let j = 0; j < codeLength; j++) {
      const randomIndex = Math.floor(Math.random() * allowedCharsLength);
      randomString += allowedChars.charAt(randomIndex);
    }
    const generatedCode = prefix + randomString;

    // 将生成的代码和传入的credit值封装成对象并添加到数组
    codesAndCredits.push({
      code: generatedCode,
      credits: creditValue, // 使用传入的 creditValue
    });
  }

  return codesAndCredits;
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const couponData = [];
  // const couponData = generateRandomCodesWithCredit('DG21', 80, 100);
  // const couponData = generateRandomCodesWithCredit('DG22', 50, 200);
  // const couponData = generateRandomCodesWithCredit('DG23', 40, 300);
  //  const couponData = generateRandomCodesWithCredit('DG25', 30, 500);
  for (let i = 0; i < couponData.length; i++) {
    await db.collection('coupon').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        credits: couponData[i].credits,
        code: couponData[i].code,
        claimed: false,
        createdAt: db.serverDate(),
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      },
    });
  }
};
