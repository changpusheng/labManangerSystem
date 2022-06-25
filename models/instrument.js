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
  }
})

module.exports = mongoose.model('Instrument', instrumentSchema)