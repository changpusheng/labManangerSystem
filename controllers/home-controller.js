const Buy = require('../models/buy')
const Item = require('../models/item')
const Record = require('../models/record')
const useMonthCount = require('../public/javascript/useCount').useMonthNumber
const useWeekhCount = require('../public/javascript/useCount').useWeekNumber
const avgCount = require('../public/javascript/useCount').avgCount
const dayjs = require('dayjs')
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)

const homeController = {
  gethome: (req, res, next) => {
    return Promise.all([Buy.find()
      .populate(['itemId', 'userId'])
      .populate({ path: 'itemId', populate: { path: 'categoryId' } })
      .populate({ path: 'itemId', populate: { path: 'unitId' } }).lean(),
    Item.find().populate(['categoryId', 'unitId']).lean(),
    Record.find().populate(['itemId', 'userId']).populate({ path: 'itemId', populate: { path: 'unitId' } }).populate({ path: 'itemId', populate: { path: 'categoryId' } }).lean().sort({ 'createAt': -1 })
    ]).then(([buys, items, records]) => {
      if (items.length) {
        let acnRecordobjs
        let recordsMonth
        let recordsTotalNumber
        let maxValueMonth
        let minValueMonth
        let recordsToxicMonth
        let recordsToxicTotalNumber
        let maxValueToxicMonth
        let minValueToxicMonth
        let avgNumberMonth
        let avgTxicNumberMonth
        let recordsDay
        let recordsTotalNumberDay
        let maxValueDay
        let minValueDay
        let recordsToxicDay
        let recordsToxicTotalNumberDay
        let maxValueToxicDay
        let minValueToxicDay
        let avgNumberDay
        let avgTxicNumberDay
        let recordsWeek
        let recordsTotalNumberWeek
        let maxValueWeek
        let minValueWeek
        let recordsToxicWeek
        let recordsToxicTotalNumberWeek
        let maxValueToxicWeek
        let minValueToxicWeek
        let avgNumberWeek
        let avgTxicNumberWeek
        //撈出還沒購買或低於安全存量資料
        const itemObjs = items.filter(obj => obj.stock < obj.safeStock && obj.isBuy === false)
        //撈出已經購買但還沒有結案的資料
        const buyIsDone = buys.filter(obj => obj.isDone === false && obj.itemId.isBuy === true)
        if (records.length) {
          const acnCategoryObj = items.filter(obj => obj.categoryId.name === '毒化物' && obj.englishName === 'ACN')
          //撈出毒化物ACN前5筆使用資料
          if (acnCategoryObj.length) {
            const acnId = acnCategoryObj[0]._id.toJSON()
            acnRecordobjs = records.filter(obj => obj.itemId._id.toJSON() === acnId).slice(0, 5)
          }

          //刪除超過一年的紀錄
          const filteYear = records.filter(obj => {
            let Year = dayjs().year()
            return (Year - dayjs(obj.createAt).year()) > 3
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

          //每日資料
          recordsDay = useMonthCount(records.slice(0, 60), '毒化物', everyDate).map(obj => {
            return dayjs(obj.date).format(`${everyDate
              }`)
          })
          recordsTotalNumberDay = useMonthCount(records.slice(0, 60), '毒化物', everyDate).map(obj => {
            return obj.number
          })

          maxValueDay = Math.max(...recordsTotalNumberDay)
          minValueDay = Math.min(...recordsTotalNumberDay)

          recordsToxicDay = useMonthCount(records.slice(0, 60), '一般溶劑', everyDate).map(obj => {
            return dayjs(obj.date).format(`${everyDate
              }`)
          })
          recordsToxicTotalNumberDay = useMonthCount(records.slice(0, 60), '一般溶劑', everyDate).map(obj => {
            return obj.number
          })

          maxValueToxicDay = Math.max(...recordsToxicTotalNumberDay)
          minValueToxicDay = Math.min(...recordsToxicTotalNumberDay)


          const avgCountDay = avgCount(recordsTotalNumberDay, recordsDay, recordsToxicTotalNumberDay, recordsToxicDay)
          avgNumberDay = avgCountDay.normal
          avgTxicNumberDay = avgCountDay.toxic

          //每週資料

          recordsWeek = useWeekhCount(records.slice(0, 120), '毒化物', everyDate).map(obj => {
            return obj.year
          })

          recordsTotalNumberWeek = useWeekhCount(records.slice(0, 120), '毒化物', everyDate).map(obj => {
            return obj.value
          })

          maxValueWeek = Math.max(...recordsTotalNumberWeek)
          minValueWeek = Math.min(...recordsTotalNumberWeek)

          recordsToxicWeek = useWeekhCount(records.slice(0, 120), '一般溶劑', everyDate).map(obj => {
            return obj.year
          })

          recordsToxicTotalNumberWeek = useWeekhCount(records.slice(0, 120), '一般溶劑', everyDate).map(obj => {
            return obj.value
          })

          maxValueToxicWeek = Math.max(...recordsToxicTotalNumberWeek)
          minValueToxicWeek = Math.min(...recordsToxicTotalNumberWeek)

          const avgCountWeek = avgCount(recordsTotalNumberWeek, recordsWeek, recordsToxicTotalNumberWeek, recordsToxicWeek)
          avgNumberWeek = avgCountWeek.normal
          avgTxicNumberWeek = avgCountWeek.toxic

          //每月資料
          recordsMonth = useMonthCount(records.slice(0, 240), '毒化物', date).map(obj => {
            return dayjs(obj.date).format(`${date
              }`)
          })
          recordsTotalNumber = useMonthCount(records.slice(0, 240), '毒化物', date).map(obj => {
            return obj.number
          })

          maxValueMonth = Math.max(...recordsTotalNumber)
          minValueMonth = Math.min(...recordsTotalNumber)

          recordsToxicMonth = useMonthCount(records.slice(0, 240), '一般溶劑', date).map(obj => {
            return dayjs(obj.date).format(`${date
              }`)
          })
          recordsToxicTotalNumber = useMonthCount(records.slice(0, 240), '一般溶劑', date).map(obj => {
            return obj.number
          })

          maxValueToxicMonth = Math.max(...recordsToxicTotalNumber)
          minValueToxicMonth = Math.min(...recordsToxicTotalNumber)

          const avgCountMonth = avgCount(recordsTotalNumber, recordsTotalNumber, recordsToxicTotalNumber, recordsToxicMonth)
          avgNumberMonth = avgCountMonth.normal
          avgTxicNumberMonth = avgCountMonth.toxic
        }
        res.render('home', {
          buyIsDone
          , itemObjs
          , acnRecordobjs,
          recordsMonth: JSON.stringify(recordsMonth),
          recordsTotalNumber: JSON.stringify(recordsTotalNumber),
          recordsToxicMonth: JSON.stringify(recordsToxicMonth),
          recordsToxicTotalNumber: JSON.stringify(recordsToxicTotalNumber),
          avgNumberMonth,
          avgTxicNumberMonth,
          recordsDay: JSON.stringify(recordsDay),
          recordsTotalNumberDay: JSON.stringify(recordsTotalNumberDay),
          recordsToxicDay: JSON.stringify(recordsToxicDay),
          recordsToxicTotalNumberDay: JSON.stringify(recordsToxicTotalNumberDay),
          avgNumberDay,
          avgTxicNumberDay,
          recordsWeek: JSON.stringify(recordsWeek),
          recordsTotalNumberWeek: JSON.stringify(recordsTotalNumberWeek),
          recordsToxicWeek: JSON.stringify(recordsToxicWeek),
          recordsToxicTotalNumberWeek: JSON.stringify(recordsToxicTotalNumberWeek),
          avgNumberWeek,
          avgTxicNumberWeek,
          maxValueMonth,
          maxValueToxicMonth,
          maxValueDay,
          maxValueToxicDay,
          maxValueWeek,
          maxValueToxicWeek,
          minValueMonth,
          minValueToxicMonth,
          minValueDay,
          minValueToxicDay,
          minValueWeek,
          minValueToxicWeek
        })
      } else {
        res.render('home')
      }
    }).catch(err => next(err))
  }
}

module.exports = homeController