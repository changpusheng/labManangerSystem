const dayjs = require('dayjs') //載入 dayjs 套件
module.exports = {
  currentYear: () => dayjs().year(),
  currentYearMonDate: () => date = dayjs().format('YYYY/MM/DD--HH:mm'),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  percentAlert: function (a, b, options) {
    return a < b ? options.fn(this) : options.inverse(this)
  }
}