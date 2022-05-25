const Buy = require('../models/buy')
const Item = require('../models/item')
const Record = require('../models/record')

const homeController = {
  gethome: (req, res, next) => {
    return Promise.all([Buy.find()
      .populate(['itemId', 'userId'])
      .populate({ path: 'itemId', populate: { path: 'categoryId' } })
      .populate({ path: 'itemId', populate: { path: 'unitId' } }).lean(),
    Item.find().populate(['categoryId', 'unitId']).lean(),
    Record.find().populate(['itemId', 'userId']).populate({ path: 'itemId', populate: { path: 'unitId' } }).lean().sort({ 'createAt': -1 })
    ]).then(([buys, items, objs]) => {
      //撈出已經購買但還沒有結案的資料
      const buyIsDone = buys.filter(obj => obj.isDone === false && obj.itemId.isBuy === true)
      //撈出還沒購買且低於安全存量資料
      const itemObjs = items.filter(obj => obj.stock < obj.safeStock && obj.isBuy === false)
      //撈出毒化物ACN前5筆使用資料
      const acnCategoryObj = items.filter(obj => obj.categoryId.name === '毒化物' && obj.englishName === 'ACN')
      const acnId = acnCategoryObj[0]._id.toJSON()
      const acnRecordobjs = objs.filter(obj => obj.itemId._id.toJSON() === acnId)
      const acnRecordobjsLimit = acnRecordobjs.slice(0, 5) //前五筆記錄
      res.render('home', {
        buyIsDone
        , itemObjs
        , acnRecordobjs: acnRecordobjsLimit
      })
    }).catch(err => next(err))
  }
}

module.exports = homeController