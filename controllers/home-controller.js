const Buy = require('../models/buy')
const Item = require('../models/item')
const Record = require('../models/record')
const Category = require('../models/category')
const Check = require('../models/check')
const Instrument = require('../models/instrument')
const useMonthCount = require('../public/javascript/useCount').useMonthNumber
const useWeekhCount = require('../public/javascript/useCount').useWeekNumber
const avgCount = require('../public/javascript/useCount').avgCount
const dayjs = require('dayjs')
const weekOfYear = require('dayjs/plugin/weekOfYear')

dayjs.extend(weekOfYear)

const homeController = {
  gethome: (req, res, next) => {
    return Promise.all([Buy.find({
      isDone
        : false
    })
      .populate(['itemId', 'userId'])
      .populate({ path: 'itemId', populate: { path: 'categoryId' } })
      .populate({ path: 'itemId', populate: { path: 'unitId' } }).lean(),
    Item.find({ isBuy: false }).populate(['categoryId', 'unitId']).lean(),
    Record.find().populate(['itemId', 'userId']).populate({ path: 'itemId', populate: { path: 'unitId' } }).populate({ path: 'itemId', populate: { path: 'categoryId' } }).lean().sort({ 'createAt': -1 }),
    Category.find().lean(),
    Item.find({ $and: [{ amountCheck: false }, { follow: true }] }).populate('categoryId').lean(),
    Check.find().populate(['itemId', 'userId']).populate({ path: 'itemId', populate: { path: 'unitId' } }).lean().sort({ createAt: -1 }),
    Instrument.find({ $and: [{ follow: true }, { checkState: true }] }).lean()
    ]).then(([buys, items, records, category, checkItems, checkTime, instruments]) => {
      if (items.length) {
        let acnRecordobjs
        let recordsValue
        //撈出還沒購買或低於安全存量資料
        const itemObjs = items.filter(obj => obj.stock < obj.safeStock)
        //撈出已經購買但還沒有結案的資料
        const buyIsDone = buys.filter(obj => obj.itemId.isBuy === true)
        if (records.length) {
          const acnCategoryObj = items.filter(obj => obj.categoryId.name === '毒化物' && obj.englishName === 'ACN')
          //撈出毒化物ACN前10筆使用資料
          if (acnCategoryObj.length) {
            const acnId = acnCategoryObj[0]._id.toJSON()
            acnRecordobjs = records.filter(obj => obj.itemId._id.toJSON() === acnId).slice(0, 10)
          }
          //刪除超過設定年限的紀錄
          const filteYear = records.filter(obj => {
            let Year = dayjs().year()
            return (Year - dayjs(obj.createAt).year()) > 2
          })
          if (filteYear.length) {
            filteYear.map(obj => {
              Record.findById(obj._id).then(item => {
                return item.remove()
              }).catch(err => next(err))
            })
          }
          let date = 'YYYY/MM'
          let everyDate = 'YYYY/MM/DD'
          let year = 'YYYY'
          let finalObj = {}
          let recordDayArr = []
          let recordWeekArr = []
          let recordMonthArr = []
          let recordYearArr = []
          category.map(obj => {
            let recordDayObj = {}
            let recordWeekObj = {}
            let recordMonthObj = {}
            let recordYearObj = {}
            //每日資料
            let recordsDay = useMonthCount(records.slice(0, 60), obj.name, everyDate).map(obj => {
              return dayjs(obj.date).format(`${everyDate
                }`)
            })
            let recordsTotalNumberDay = useMonthCount(records.slice(0, 60), obj.name, everyDate).map(obj => {
              return obj.number
            })

            recordDayObj['date'] = 'day'
            recordDayObj['category'] = obj.name
            recordDayObj['day'] = recordsDay
            recordDayObj['value'] = recordsTotalNumberDay
            recordDayObj['max'] = Math.max(...recordsTotalNumberDay)
            recordDayObj['min'] = Math.min(...recordsTotalNumberDay)
            recordDayObj['avg'] = avgCount(recordsTotalNumberDay, recordsDay)
            recordDayArr.push(recordDayObj)
            //每週資料
            let recordsWeek = useWeekhCount(records.slice(0, 120), obj.name, everyDate).map(obj => {
              return obj.year
            })
            let recordsTotalNumberWeek = useWeekhCount(records.slice(0, 120), obj.name, everyDate).map(obj => {
              return obj.value
            })
            recordWeekObj['date'] = 'week'
            recordWeekObj['category'] = obj.name
            recordWeekObj['day'] = recordsWeek
            recordWeekObj['value'] = recordsTotalNumberWeek
            recordWeekObj['max'] = Math.max(...recordsTotalNumberWeek)
            recordWeekObj['min'] = Math.min(...recordsTotalNumberWeek)
            recordWeekObj['avg'] = avgCount(recordsTotalNumberWeek, recordsWeek)
            recordWeekArr.push(recordWeekObj)
            //每月資料
            let recordsMonth = useMonthCount(records.slice(0, 240), obj.name, date).map(obj => {
              return dayjs(obj.date).format(`${date
                }`)
            })
            let recordsTotalNumber = useMonthCount(records.slice(0, 240), obj.name, date).map(obj => {
              return obj.number
            })
            recordMonthObj['date'] = 'month'
            recordMonthObj['category'] = obj.name
            recordMonthObj['day'] = recordsMonth
            recordMonthObj['value'] = recordsTotalNumber
            recordMonthObj['max'] = Math.max(...recordsTotalNumber)
            recordMonthObj['min'] = Math.min(...recordsTotalNumber)
            recordMonthObj['avg'] = avgCount(recordsTotalNumber, recordsMonth)
            recordMonthArr.push(recordMonthObj)
            //每年資料
            let recordsYear = useMonthCount(records.slice(0, 360), obj.name, year).map(obj => {
              return dayjs(obj.date).format(`${year
                }`)
            })
            let recordsYearNumber = useMonthCount(records.slice(0, 360), obj.name, year).map(obj => {
              return obj.number
            })
            recordYearObj['date'] = 'year'
            recordYearObj['category'] = obj.name
            recordYearObj['day'] = recordsYear
            recordYearObj['value'] = recordsYearNumber
            recordYearObj['max'] = Math.max(...recordsYearNumber)
            recordYearObj['min'] = Math.min(...recordsYearNumber)
            recordYearObj['avg'] = avgCount(recordsYearNumber, recordsYear)
            recordYearArr.push(recordYearObj)
          })
          finalObj['day'] = recordDayArr
          finalObj['week'] = recordWeekArr
          finalObj['month'] = recordMonthArr
          finalObj['year'] = recordYearArr
          recordsValue = finalObj
        }
        res.render('home', {
          buyIsDone
          , itemObjs
          , acnRecordobjs,
          category,
          recordsValue: JSON.stringify(recordsValue),
          categoryObj: JSON.stringify(category),
          checkItems,
          instruments
        })
      } else {
        res.render('home', {
          category,
          checkItems,
          instruments
        })
      }
    }).catch(err => next(err))
  }
}

module.exports = homeController