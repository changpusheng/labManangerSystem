const Record = require('../models/record')
const Buy = require('../models/buy')

const recordContriller = {
  getItemUseRecord: (req, res) => {
    Record.find().populate(['userId', 'buyId', 'itemId'])
      .populate({ path: 'itemId', populate: { path: 'categoryId' } })
      .populate({ path: 'itemId', populate: { path: 'unitId' } })
      .lean().sort({ 'createAt': -1 }).then(records => {
        res.render('admin/itemUseRecord', { records })
      })
  },
  getItemBuyRecord: (req, res) => {
    Buy.find().populate(['userId', 'itemId'])
      .populate({ path: 'itemId', populate: { path: 'categoryId' } })
      .populate({ path: 'itemId', populate: { path: 'unitId' } }).lean().sort({ 'createAt': -1 }).then(buys => {
        res.render('admin/itemBuyRecord', { buys })
      })
  }
}

module.exports = recordContriller