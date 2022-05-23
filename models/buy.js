const mongoose = require('mongoose')
const Schema = mongoose.Schema
const buySchema = new Schema({
  number: {
    type: Number,
    required: true
  },
  createAt: {
    type: String,
    required: true
  },
  commit: {
    type: String,
    required: true
  },
  isDone: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    required: false
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    index: true,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('Buy', buySchema)