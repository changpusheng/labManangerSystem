const mongoose = require('mongoose')
const Schema = mongoose.Schema
const configSchema = new Schema({
  name: {
    type: String,
    required: true
  }, data: {
    type: String,
    required: true
  }, other: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('Config', configSchema)