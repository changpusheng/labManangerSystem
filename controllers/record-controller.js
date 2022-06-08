const Record = require('../models/record')
const Buy = require('../models/buy')
const dimStringSearch = require('../public/javascript/dimStringSearch')

const recordContriller = {
  getItemUseRecord: (req, res, next) => {
    Record.find().populate(['userId', 'buyId', 'itemId'])
      .populate({
        path: 'itemId', populate: {
          path: 'categoryId'
        }
      })
      .populate({ path: 'itemId', populate: { path: 'unitId' } })
      .lean().sort({ 'createAt': -1 }).then(records => {
        let keyWord = req.query.itemUseRecord
        let filterObj
        if (keyWord) {
          keyWord = req.query.itemUseRecord.trim().toLowerCase()
          const recordFileter = records.filter(obj => {
            const categoryObj = dimStringSearch(obj.itemId.categoryId.name, keyWord)
            const createAtObj = dimStringSearch(obj.createAt, keyWord)
            const itemNameObj = dimStringSearch(obj.itemId.name, keyWord)
            const userObj = dimStringSearch(obj.userId.name, keyWord)
            return categoryObj || createAtObj || itemNameObj || userObj
          })
          filterObj = recordFileter
        } else {
          filterObj = records
        }
        res.render('admin/itemUseRecord', { records: filterObj, keyWord })
      }).catch(err => next(err))
  },
  getItemBuyRecord: (req, res, next) => {
    Buy.find().populate(['userId', 'itemId'])
      .populate({ path: 'itemId', populate: { path: 'categoryId' } })
      .populate({ path: 'itemId', populate: { path: 'unitId' } }).lean().sort({ 'createAt': -1 }).then(buys => {
        let keyWord = req.query.itemBuyRecord
        let filterObj
        if (keyWord) {
          keyWord = req.query.itemBuyRecord.trim().toLowerCase()
          const recordFileter = buys.filter(obj => {
            const categoryObj = dimStringSearch(obj.itemId.categoryId.name, keyWord)
            const createAtObj = dimStringSearch(obj.createAt, keyWord)
            const itemNameObj = dimStringSearch(obj.itemId.name, keyWord)
            const userObj = dimStringSearch(obj.userId.name, keyWord)
            return categoryObj || createAtObj || itemNameObj || userObj
          })
          filterObj = recordFileter
        } else {
          filterObj = buys
        }
        res.render('admin/itemBuyRecord', { buys: filterObj })
      }).catch(err => next(err))
  }
}

module.exports = recordContriller