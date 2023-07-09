const mongoose = require('mongoose')

// 定义子菜单 
const submenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // 前端路由名称
  url: {
    type: String,
    required: true,
    default: null
  },
  // 上级菜单
  parentId: {
    type: [mongoose.Schema.Types.ObjectId]
  },
  // 菜单图标
  icon: {
    type: String,
    default: ''
  },
  // 排序
  sort: {
    type: Number,
    default: 0
  },
  // 类型
  type: {
    type: Number,
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

// 定义父菜单
const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // 前端路由名称
  url: {
    type: String,
    required: true,
    default: null
  },
  // 菜单图标
  icon: {
    type: String,
    default: ''
  },
  // 排序
  sort: {
    type: Number,
    default: 0
  },
  // 类型
  type: {
    type: Number,
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
    type: [submenuSchema] // 避免无限递归
  }
})

// 将 schemam 发布为 Model 模型
const menuModel = mongoose.model('menu', menuSchema)

// 导出模型
module.exports = menuModel