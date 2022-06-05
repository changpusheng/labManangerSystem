const Buy = require('../models/buy')
const Item = require('../models/item')
const Record = require('../models/record')
const useMonthCount = require('../public/javascript/useCount').useMonthNumber
const useWeekhCount = require('../public/javascript/useCount').useWeekNumber
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
      let acnRecordobjs
      let recordsMonth
      let recordsTotalNumber
      let recordsToxicMonth
      let recordsToxicTotalNumber
      let avgNumber
      let avgTxicNumber
      if (items.length) {
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

          console.log(useWeekhCount(records.slice(0, 150), '毒化物', everyDate))

          recordsMonth = useMonthCount(records.slice(0, 300), '毒化物', date).map(obj => {
            return dayjs(obj.date).format(`${date
              }`)
          })
          recordsTotalNumber = useMonthCount(records.slice(0, 300), '毒化物', date).map(obj => {
            return obj.number
          })

          recordsToxicMonth = useMonthCount(records.slice(0, 300), '一般溶劑', date).map(obj => {
            return dayjs(obj.date).format(`${date
              }`)
          })
          recordsToxicTotalNumber = useMonthCount(records.slice(0, 300), '一般溶劑', date).map(obj => {
            return obj.number
          })

          //一般溶劑使用平均
          const init = 0
          const totalNormalNumber = recordsTotalNumber.reduce((pre, curr) => pre + curr, init)
          avgNumber = totalNormalNumber / recordsTotalNumber.length
          //毒化物使用平均
          const totalToxicNumber = recordsToxicTotalNumber.reduce((pre, curr) => pre + curr, init)
          avgTxicNumber = totalToxicNumber / recordsToxicMonth.length

        }

        res.render('home', {
          buyIsDone
          , itemObjs
          , acnRecordobjs,
          recordsMonth: JSON.stringify(recordsMonth),
          recordsTotalNumber: JSON.stringify(recordsTotalNumber),
          recordsToxicMonth: JSON.stringify(recordsToxicMonth),
          recordsToxicTotalNumber: JSON.stringify(recordsToxicTotalNumber),
          avgNumber: avgNumber,
          avgTxicNumber: avgTxicNumber
        })
      } else {
        res.render('home')
      }
    }).catch(err => next(err))
  }
}

module.exports = homeController