// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  try {
    // 先取出集合记录总数
    const countResult = await db.collection('product_dzsk').count()
    const total = countResult.total

    console.log('总记录数：', total)

    // 计算需分几次取
    const batchTimes = Math.ceil(total / MAX_LIMIT)

    console.log('需要分', batchTimes, '次取数据')

    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('product_dzsk').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }

    // 等待所有
    const result = await Promise.all(tasks)

    // 将返回的 data 数组连接起来
    const data = result.reduce((acc, cur) => {
      return acc.concat(cur.data)
    }, [])

    console.log('实际读取到', data.length, '条记录')

    return {
      success: true,
      data: data,
      total: total
    }
  } catch (err) {
    console.error('云函数执行失败：', err)
    return {
      success: false,
      error: err.message
    }
  }
}





