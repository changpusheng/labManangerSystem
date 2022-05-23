const dayjs = require('dayjs') //載入 dayjs 套件

const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime) //近期時間

module.exports = {
  currentYear: () => dayjs().year(),
  currentYearMonDate: () => date = dayjs().format('YYYY/MM/DD--HH:mm'),
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
  }
}