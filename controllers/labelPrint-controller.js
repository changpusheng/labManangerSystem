const originObjLabelPrintXlsx = require('../public/javascript/originObj')
const Config = require('../models/config')
const dayjs = require('dayjs')

const labelPrintContriller = {
  getOriginObj: (req, res, next) => {

    const { startDate, endDate, search, lot, output
    } = req.query
    const start = dayjs(startDate).format('YYYY/MM/DD')
    const end = dayjs(endDate).format('YYYY/MM/DD')

    Config.findOne({ name: 'originSearchDate' }).then(obj => {
      if (dayjs(start).year() === dayjs(end).year() && dayjs(start).month() === dayjs(end).month()) {
        if (dayjs(start).date() > dayjs(end).date()) throw new Error('同年同月，開始日期的日期不能大於結束日期的日期')
      }
      if (dayjs(start).year() === dayjs(end).year()) {
        if (dayjs(start).month() > dayjs(end).month()) throw new Error('同年份，開始日期的月份不能大於結束日期的月份')
      }
      if (dayjs(start).year() > dayjs(end).year()) throw new Error('不同年份，開始日期的年份必須小於結束日期的年份')

      if (!startDate || !endDate) {
        if (!obj) {
          return Config.create({
            name: 'originSearchDate',
            data: dayjs().format('YYYY/MM/DD')
          })
        }
        res.render('labelPrint/originObj', {
          startDate,
          endDate,
          obj: obj.data
        })
      } else {
        const passItems = originObjLabelPrintXlsx.readData(start, end, search, lot).filterPassObj
        const failItems = originObjLabelPrintXlsx.readData(start, end, search, lot).filterFailObj
        if (Number(output)) {
          req.flash('success_messages', '匯出檔案成功')
          originObjLabelPrintXlsx.outputDate(passItems, failItems)
          obj.data = endDate
          obj.save()
        }
        res.render('labelPrint/originObj', {
          startDate,
          endDate,
          passItems,
          failItems,
          lot,
          search,
          obj: obj.data
        })
      }

    }).catch(err => next(err))



  }
}

module.exports = labelPrintContriller