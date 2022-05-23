const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  safeStock: {
    type: Number,
    required: true
  },
  fullStock: {
    type: Number,
    required: true
  },
  casNumber: {
    type: String,
    required: true
  },
  englishName: {
    type: String,
    required: true
  },
  isBuy: {
    type: Boolean,
    default: false
  },
  factors: {
    type: Number,
    default: true
  },
  image: {
    type: String,
    required: false
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    index: true,
    required: true
  },
  unitId: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('Item', itemSchema)