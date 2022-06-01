const Buy = require('../models/buy')
const Item = require('../models/item')
const Record = require('../models/record')
const dayjs = require('dayjs')

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
      let recordsDay
      let recordsTotalNumber
      let recordsToxicDay
      let recordsToxicTotalNumber
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

          //刪除超過兩年的紀錄
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

          //一般溶劑使用量
          //撈出每日溶劑使用量
          const chartDateArr = []
          const chartDateOutNumber = []
          const outputDataArr = []
          //毒化物溶劑使用量
          const toxicDateArr = []
          const toxicDateOutNumber = []
          const toxicOutputDataArr = []

          const normalObj = records.filter(obj => {
            return obj.itemId.categoryId.name !== '毒化物'
          })
          normalObj.map(obj => {
            const date = dayjs(obj.createAt).format('YYYY/MM')
            chartDateArr.push(date)
          })
          //剔除重覆的元素
          const chartDateFilter = chartDateArr.filter((date, index) => {
            return chartDateArr.indexOf(date) === index
          })
          //每日使用量加入陣列
          for (let i = 0; i < chartDateFilter.length; i++) {
            const itemFilter = normalObj.filter(obj => {
              return dayjs(obj.createAt).format('YYYY/MM') === chartDateFilter[i]
            })
            const itemMap = itemFilter.map(obj => obj.outNumber)
            const outNumberTotalValue = itemMap.reduce((pre, curr) => pre + curr)
            chartDateOutNumber.push(outNumberTotalValue)
          }
          //物件寫入日期與使用量
          for (let i = 0; i < chartDateFilter.length; i++) {
            const outputData = {}
            outputData['date'] = dayjs(chartDateFilter[i]).format()
            outputData['number'] = chartDateOutNumber[i]
            outputDataArr.push(outputData)
          }
          //依照日期排序
          const daySort = outputDataArr.sort((a, b) => {
            return a > b ? 1 : -1
          })
          recordsDay = daySort.map(obj => {
            return dayjs(obj.date).format('YYYY/MM')
          })
          recordsTotalNumber = daySort.map(obj => {
            return obj.number
          })
          const toxicObj = records.filter(obj => {
            return obj.itemId.categoryId.name !== '一般溶劑'
          })
          toxicObj.map(obj => {
            const date = dayjs(obj.createAt).format('YYYY/MM')
            toxicDateArr.push(date)
          })
          //剔除重覆的元素
          const toxicDateFilter = toxicDateArr.filter((date, index) => {
            return toxicDateArr.indexOf(date) === index
          })
          //每日使用量加入陣列
          for (let i = 0; i < toxicDateFilter.length; i++) {
            const itemFilter = toxicObj.filter(obj => {
              return dayjs(obj.createAt).format('YYYY/MM') === toxicDateFilter[i]
            })
            const itemMap = itemFilter.map(obj => obj.outNumber)
            const outNumberTotalValue = itemMap.reduce((pre, curr) => pre + curr)
            toxicDateOutNumber.push(outNumberTotalValue)
          }
          //物件寫入日期與使用量
          for (let i = 0; i < toxicDateFilter.length; i++) {
            const outputData = {}
            outputData['date'] = dayjs(toxicDateFilter[i]).format()
            outputData['number'] = toxicDateOutNumber[i]
            toxicOutputDataArr.push(outputData)
          }
          //依照日期排序
          const dayToxicSort = toxicOutputDataArr.sort((a, b) => {
            return a > b ? 1 : -1
          })
          recordsToxicDay = dayToxicSort.map(obj => {
            return dayjs(obj.date).format('YYYY/MM')
          })
          recordsToxicTotalNumber = dayToxicSort.map(obj => {
            return obj.number
          })
        }
        res.render('home', {
          buyIsDone
          , itemObjs
          , acnRecordobjs,
          recordsDay: JSON.stringify(recordsDay),
          recordsTotalNumber: JSON.stringify(recordsTotalNumber),
          recordsToxicDay: JSON.stringify(recordsToxicDay),
          recordsToxicTotalNumber: JSON.stringify(recordsToxicTotalNumber)
        })
      } else {
        res.render('home')
      }
    }).catch(err => next(err))
  }
}

module.exports = homeController