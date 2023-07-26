
const mongoose = require('mongoose')

const productTypeSchema = new mongoose.Schema([{
  name: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}])

const productTypeModel = mongoose.model('productType', productTypeSchema)
module.exports = productTypeModel