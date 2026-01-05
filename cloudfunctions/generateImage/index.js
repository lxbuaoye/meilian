// 云函数入口文件
const cloud = require('wx-server-sdk');
const https = require('https');
const axios = require('axios');
const { getBodySha, sign, getDateTimeNow } = require('./sign.js');
const qs = require('querystring');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

// 从事件参数获取 AK 和 SK（通过前端传递或云环境变量）
const ACCESS_KEY = event.accessKey || process.env.VOLCENGINE_ACCESS_KEY;
const SECRET_KEY = event.secretKey || process.env.VOLCENGINE_SECRET_KEY;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  console.log(event.imageUrl);
  console.log(event.prompt);
  // 请求体
  const requestBody = {
    req_key: 'i2i_xl_sft',
    image_urls: [event.imageUrl],
    prompt: event.prompt,
    controlnet_args: [
      {
        type: 'canny',
        strength: 0.4,
        binary_data_index: 0,
      },
    ],
    return_url: true,
  };

  const data = JSON.stringify(requestBody);

  const signParams = {
    headers: {
      // x-date header 是必传的
      ['X-Date']: getDateTimeNow(),
      'Content-Type': 'application/json',
    },
    method: 'POST',
    query: {
      Action: 'Img2ImgXLSft',
      Version: '2022-08-31',
    },
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    serviceName: 'cv',
    region: 'cn-north-1',
    bodySha: getBodySha(data),
  };

  // 正规化 query object， 防止串化后出现 query 值为 undefined 情况
  for (const [key, val] of Object.entries(signParams.query)) {
    if (val === undefined || val === null) {
      signParams.query[key] = '';
    }
  }

  const authorization = sign(signParams);
  console.log(authorization);
  const res = await axios.post(
    `https://visual.volcengineapi.com/?${qs.stringify(signParams.query)}`,

    data,
    {
      headers: {
        ...signParams.headers,
        Authorization: authorization,
      },
      method: signParams.method,
    },
  );

  return res.data;
};
