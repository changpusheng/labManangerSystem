const dayjs = require('dayjs') //載入 dayjs 套件

const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime) //近期時間

module.exports = {
  currentDay: () => dayjs().format('YYYY/MM/DD'),
  currentYear: () => dayjs().year(),
  currentYearMonDate: (a) => dayjs(a).format('YYYY/MM/DD'),
  ifCondToJson: function (a, b, options) {
    return a.toJSON() === b ? options.fn(this) : options.inverse(this)
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  percentAlert: function (a, b, options) {
    return a < b ? options.fn(this) : options.inverse(this)
  },
  percentMax: function (a, b, options) {
    return a > b ? options.fn(this) : options.inverse(this)
  },
  ifNot: function (a, b, options) {
    return a !== b ? options.fn(this) : options.inverse(this)
  },
  factorChangeValue: (facters, number) => {
    let value = facters * number
    return value.toFixed(3)
  },
  toFixed: (value, number) => {
    let finalValue = value.toFixed(number)
    return finalValue
  },
  toLastNumber: (value) => {
    let getValue = value.toJSON().slice(-5)
    return getValue
  },
  bottleNumber: (value, number, density, vol) => {
    let bottleNumber = value.toFixed(number) / density / vol
    let remainder = (bottleNumber - Math.trunc(bottleNumber)) * 1000
    let finalValue = Math.trunc(bottleNumber) + '瓶' + Math.round(remainder) + 'ml'
    return finalValue
  },
  firstIndexName: (a) => {
    return a[0].name
  },
  getEndText: (value, number) => {
    const valueLength = value.length
    const getNumber = valueLength - number
    let getValue = value.slice(-getNumber)
    return getValue
  },
  expandItemKey: (items) => {
    console.log(items)
    const itemsKeyLength = Object.keys(items).length
    const itemKeyArr = []
    for (let i = 0; i < itemsKeyLength; i++) {
      const itemKey = Object.keys(items)[i]
      const itemValue = items[`${itemKey}`]
      const sample = `${itemKey}:${itemValue}`
      itemKeyArr.push(sample)
    }
    return itemKeyArr.map(obj => obj)
  }
}