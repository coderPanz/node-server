// 导入配置信息
const { HOST, PORT, NAME } = require('../config/config')
const mongoose = require('mongoose')
/**
 * 
 * @param {*} success // 连接成功的回调
 * @param {*} error // 连接失败的回调
 */
module.exports = (success, error) => {

  // 优化操作, 外部不需要传入error函数, 实现在内部回调即可
  if(typeof error !== 'function') {
    error = () => {
      console.log('连接失败')
    }
  }

  // 连接数据库
  mongoose.connect(`mongodb://${HOST}:${PORT}/${NAME}`)

  // 连接状态回调
  mongoose.connection.once('open', () => {
    success()
  })

  mongoose.connection.once('error', () => {
    error()
  })

  mongoose.connection.once('close', () => {
    console.log('连接关闭!')
  })

}
