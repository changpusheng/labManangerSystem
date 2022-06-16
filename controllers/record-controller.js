const Record = require('../models/record')
const Buy = require('../models/buy')
const Item = require('../models/item')
const dimStringSearch = require('../public/javascript/dimStringSearch')
const { getOffset, getPagination } = require('../helpers/page-helper')
const sentEmail = require('../public/javascript/email')

const recordContriller = {
  getItemUseRecord: (req, res, next) => {
    const DEFAULT_LIMIT = 100
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
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
        let getPaginationfn
        if (keyWord) {
          keyWord = req.query.itemUseRecord.trim().toLowerCase()
          const recordFileter = records.filter(obj => {
            const categoryObj = dimStringSearch(obj.itemId.categoryId.name, keyWord)
            const createAtObj = dimStringSearch(obj.createAt, keyWord)
            const itemNameObj = dimStringSearch(obj.itemId.name, keyWord)
            const userObj = dimStringSearch(obj.userId.name, keyWord)
            return categoryObj || createAtObj || itemNameObj || userObj
          })
          filterObj = recordFileter.slice(offset, offset + limit)
          getPaginationfn = getPagination(limit, page, filterObj.length)
        } else {
          filterObj = records.slice(offset, offset + limit)
          getPaginationfn = getPagination(limit, page, records.length)
        }
        res.render('admin/itemUseRecord', {
          records: filterObj, keyWord, pagination: getPaginationfn
        })
      }).catch(err => next(err))
  },
  getItemBuyRecord: (req, res, next) => {
    const DEFAULT_LIMIT = 100
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Buy.find().populate(['userId', 'itemId'])
      .populate({ path: 'itemId', populate: { path: 'categoryId' } })
      .populate({ path: 'itemId', populate: { path: 'unitId' } }).lean().sort({ 'createAt': -1 }).then(buys => {
        let keyWord = req.query.itemBuyRecord
        let filterObj
        let getPaginationfn
        if (keyWord) {
          keyWord = req.query.itemBuyRecord.trim().toLowerCase()
          const recordFileter = buys.filter(obj => {
            const commit = dimStringSearch(obj.commit, keyWord)
            const categoryObj = dimStringSearch(obj.itemId.categoryId.name, keyWord)
            const createAtObj = dimStringSearch(obj.createAt, keyWord)
            const itemNameObj = dimStringSearch(obj.itemId.name, keyWord)
            const userObj = dimStringSearch(obj.userId.name, keyWord)
            return categoryObj || createAtObj || itemNameObj || userObj || commit
          })
          filterObj = recordFileter.slice(offset, offset + limit)
          getPaginationfn = getPagination(limit, page, buys.length)
        } else {
          filterObj = buys.slice(offset, offset + limit)
          getPaginationfn = getPagination(limit, page, buys.length)
        }
        res.render('admin/itemBuyRecord', { buys: filterObj, keyWord, pagination: getPaginationfn })
      }).catch(err => next(err))
  }
}

module.exports = recordContriller