const mongoose = require('mongoose')

const productCountSalesSchema = new mongoose.Schema([{
  address: {
    type: String,
    required: true
  },
  count: {
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

const productCountSalesModel = mongoose.model('productCountSales', productCountSalesSchema)

module.exports = productCountSalesModel