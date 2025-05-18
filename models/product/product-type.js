/**
  Author: qs
  Date: 2024-11-22 16:28:27
  LastEditTime: 2025-05-15 19:55:22
  LastEditors: qs
  Description: 
  FilePath: /node-server/models/product/product-type.js
  
 */

const mongoose = require('mongoose')

const productTypeSchema = new mongoose.Schema([
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      default: 0,
    },
    img: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
])

const productTypeModel = mongoose.model('productType', productTypeSchema)
module.exports = productTypeModel