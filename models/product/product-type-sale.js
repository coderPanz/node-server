/**
  Author: qs
  Date: 2024-11-22 16:28:27
  LastEditTime: 2025-03-13 20:30:17
  LastEditors: qs
  Description: 
  FilePath: /node-server/models/product/product-type-sale.js
  
 */
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
