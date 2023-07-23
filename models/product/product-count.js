const mongoose = require('mongoose')

const productCountSchema = new mongoose.Schema([{
  keywords: {
    type: String
  },
  title: {
    type: String
  },
  tips: {
    type: String
  },
  subTitle: {
    type: String
  },
  number1: {
    type: Number
  },
  number2: {
    type: Number
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

const productCountModel = mongoose.model('productCount', productCountSchema)
module.exports = productCountModel
