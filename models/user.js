const mongoose = require('mongoose')
const roleModel = require('./role')
const departmentModel = require('./department')
// 定义用户模型数据结构 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false // 表示不返回密码到前端
  },
  // 角色
  rolesId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: roleModel
  },
  // 部门
  departmentId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: departmentModel
  },
  // 是否可用
  status: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// 将 schemam 发布为 Model 模型
const userModel = mongoose.model('user', userSchema)

// 导出模型
module.exports = userModel