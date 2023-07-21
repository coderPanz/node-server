const mongoose = require('mongoose')
// 定义父菜单
const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  // 前端路由名称
  url: {
    type: String
  },
  // 菜单图标
  icon: {
    type: String
  },
  // 排序
  sort: {
    type: Number
  },
  // 类型
  type: {
    type: Number
  },
  permission: {
    type: String,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId
  },
  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now
  },
  // 更新时间
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // 子菜单
  children: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'menu'
  }
})

// 将 schemam 发布为 Model 模型
const menuModel = mongoose.model('menu', menuSchema)

// 导出模型
module.exports = menuModel