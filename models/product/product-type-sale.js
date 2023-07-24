const mongoose = require('mongoose')

const productTypeSaleSchema = new mongoose.Schema([{
  name: {
    type: String,
    required: true
  },
  sale: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  },
  favor: {
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

const productTypeSaleModel = mongoose.model('productTypeSale', productTypeSaleSchema)
module.exports = productTypeSaleModel
