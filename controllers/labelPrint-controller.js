const originObjLabelPrintXlsx = require('../public/javascript/originObj')
const Config = require('../models/config')
const dayjs = require('dayjs')

const labelPrintContriller = {
  getOriginObj: (req, res, next) => {
    const { startDate, endDate, search, lot, output
    } = req.query
    const start = dayjs(startDate).format('YYYY/MM/DD')
    const end = dayjs(endDate).format('YYYY/MM/DD')
    let lastTime
    if (dayjs(start).year() === dayjs(end).year() && dayjs(start).month() === dayjs(end).month()) {
      if (dayjs(start).date() > dayjs(end).date()) throw new Error('同年同月，開始日期的日期不能大於結束日期的日期')
    }
    if (dayjs(start).year() === dayjs(end).year()) {
      if (dayjs(start).month() > dayjs(end).month()) throw new Error('同年份，開始日期的月份不能大於結束日期的月份')
    }
    if (dayjs(start).year() > dayjs(end).year()) throw new Error('不同年份，開始日期的年份必須小於結束日期的年份')
    let passItems = 0
    let failItems = 0
    if (startDate && endDate) {
      passItems = originObjLabelPrintXlsx.readData(start, end, search, lot).filterPassObj
      failItems = originObjLabelPrintXlsx.readData(start, end, search, lot).filterFailObj
    }
    Config.findOne({ name: '原料標籤日期' }).then(obj => {
      lastTime = obj.data
      if (!obj) {
        return Config.create({
          name: '原料標籤日期',
          data: dayjs().format('YYYY/MM/DD')
        })
      } else {
        return obj
      }
    }).then(obj => {
      if (Number(output)) {
        originObjLabelPrintXlsx.outputDate(passItems, failItems)
        lastTime = endDate
        obj.data = endDate
        return obj.save()
      } else {
        return obj
      }
    }).then(() => {
      res.render('labelPrint/originObj', {
        startDate,
        endDate,
        passItems,
        failItems,
        lot,
        search,
        obj: lastTime,
        output: Number(output)
      })
    }).catch(err => next(err))
  }
}

module.exports = labelPrintContriller