const mongoose = require('mongoose')

const productInfosSchema = new mongoose.Schema([{
  name: {
    type: String,
    required: true
  },
  img: {
    type: String,
    default: ''
  },
  type: {
    type: String
  },
  stock: {
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

const productInfosModel = mongoose.model('productInfos', productInfosSchema)
module.exports = productInfosModel