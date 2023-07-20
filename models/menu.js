const mongoose = require('mongoose')

// 定义二级子菜单: 该菜单做按钮权限
const subTwoMenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // 前端路由名称M
  url: {
    type: String,
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
  permission: {
    type: String,
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

// 定义子菜单 
const subMenuSchema = new mongoose.Schema({
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
  // 二级子菜单
  children:{
    type: [subTwoMenuSchema]
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
    type: [subMenuSchema] // 避免无限递归
  }
})

// 将 schemam 发布为 Model 模型
const menuModel = mongoose.model('menu', menuSchema)

// 导出模型
module.exports = menuModel