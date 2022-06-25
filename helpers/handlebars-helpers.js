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
    let remainder = (bottleNumber - Math.trunc(bottleNumber)) * density
    let finalValue = Math.trunc(bottleNumber) + '瓶' + remainder.toFixed(2) + 'kg'
    return finalValue
  },
  firstIndexName: (a) => {
    return a[0].name
  }
}