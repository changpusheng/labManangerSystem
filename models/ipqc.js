const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ipqcSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  itemName1: {
    type: String,
    required: false
  },
  bigNumber1: {
    type: String,
    required: false
  },
  smallNumber1: {
    type: String,
    required: false
  },
  itemName2: {
    type: String,
    required: false
  },
  bigNumber2: {
    type: String,
    required: false
  },
  smallNumber2: {
    type: String,
    required: false
  },
  itemName3: {
    type: String,
    required: false
  },
  bigNumber3: {
    type: String,
    required: false
  },
  smallNumber3: {
    type: String,
    required: false
  },
  itemName4: {
    type: String,
    required: false
  },
  bigNumber4: {
    type: String,
    required: false
  },
  smallNumber4: {
    type: String,
    required: false
  },
  itemName5: {
    type: String,
    required: false
  },
  bigNumber5: {
    type: String,
    required: false
  },
  smallNumber5: {
    type: String,
    required: false
  },
  itemName6: {
    type: String,
    required: false
  },
  bigNumber6: {
    type: String,
    required: false
  },
  smallNumber6: {
    type: String,
    required: false
  },
  itemName7: {
    type: String,
    required: false
  },
  bigNumber7: {
    type: String,
    required: false
  },
  smallNumber7: {
    type: String,
    required: false
  },
  itemName8: {
    type: String,
    required: false
  },
  bigNumber8: {
    type: String,
    required: false
  },
  smallNumber8: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('IPQC', ipqcSchema)