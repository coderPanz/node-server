const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true 
  },
  leader: {
    type: String,
    required: true
  },
  parentId: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  parentName: {
    type: String
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

const departmentModel = mongoose.model('department', departmentSchema)
module.exports = departmentModel