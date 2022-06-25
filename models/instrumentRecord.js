const mongoose = require('mongoose')
const Schema = mongoose.Schema
const instrumentRecordSchema = new Schema({
  name: {
    type: Schema.Types.ObjectId,
    ref: 'Instrument',
    required: true,
    index: true,
    required: true
  },
  operator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  checkman: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  isUse: {
    type: Boolean,
    default: false
  },
  isPass: {
    type: Boolean,
    default: false
  },
  createAt: {
    type: String,
    required: true
  },
  nextTime: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('InstrumentRecord', instrumentRecordSchema)