const mongoose = require('mongoose')
const Schema = mongoose.Schema
const instrumentRecordSchema = new Schema({
  instrumentId: {
    type: Schema.Types.ObjectId,
    ref: 'Instrument',
    required: true,
    index: true,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  createAt: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  isClose: {
    type: Boolean,
    default: false
  },
  isFix: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('InstrumentRecord', instrumentRecordSchema)