const mongoose = require('mongoose')
const Schema = mongoose.Schema

const checkSchema = new Schema({
  amountBefore: {
    type: Number,
    required: true
  },
  amountAfter: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    index: true,
    required: true
  },
  createAt: {
    type: String,
    required: true
  },
  nextTime: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Check', checkSchema)