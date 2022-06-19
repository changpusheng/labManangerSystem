const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  follow: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Category', categorySchema)