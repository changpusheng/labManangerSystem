const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
  inputNumber: {
    type: Number,
    required: true
  }, outNumber: {
    type: Number,
    required: true
  },
  createAt: {
    type: String,
    required: true
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

module.exports = mongoose.model('Record', recordSchema)