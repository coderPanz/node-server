const mongoose = require('mongoose')
const menuModel = require('../models/menu')
// 定义用户模型数据结构 
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  // 角色权限列表
  menus: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: menuModel
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
  }
})

// 将 schemam 发布为 Model 模型
const roleModel = mongoose.model('role', roleSchema)

// 导出模型
module.exports = roleModel