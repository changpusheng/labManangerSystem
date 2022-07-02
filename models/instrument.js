const mongoose = require('mongoose')
const Schema = mongoose.Schema
const instrumentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  follow: {
    type: Boolean,
    default: false
  },
  checkState: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model('Instrument', instrumentSchema)