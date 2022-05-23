const Record = require('../models/record')
const Buy = require('../models/buy')

const recordContriller = {
  getItemUseRecord: (req, res) => {
    Record.find().populate(['userId', 'buyId']).lean().then(records => {
      res.render('item/itemUseRecord', { records })
    })
  },
  getItemBuyRecord: (req, res) => {
    Buy.find().populate(['userId', 'itemId']).lean().then(Buys => {
      res.render('item/itemBuyRecord', { Buys })
    })
  }
}

module.exports = recordContriller