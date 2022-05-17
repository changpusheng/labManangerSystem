const mongoose = require('mongoose')
const Schema = mongoose.Schema
const configSchema = new Schema({
  name: {
    type: String,
    required: true
  }, configData: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Config', configSchema)