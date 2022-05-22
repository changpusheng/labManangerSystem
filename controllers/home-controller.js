const Buy = require('../models/buy')
const Item = require('../models/item')

const homeController = {
  gethome: (req, res, next) => {
    return Promise.all([Buy.find()
      .populate(['itemId', 'userId'])
      .populate({ path: 'itemId', populate: { path: 'categoryId' } })
      .populate({ path: 'itemId', populate: { path: 'unitId' } }).lean(),
    Item.find()
      .populate(['categoryId', 'unitId']).lean()])
      .then(([buys, items]) => {
        const buyIsDone = buys.filter(obj => obj.isDone === false && obj.itemId.isBuy === true)
        const itemObjs = items.filter(obj => obj.stock < obj.safeStock && obj.isBuy === false)
        
        res.render('home', {
          buyIsDone
          , itemObjs
        })
      }).catch(err => next(err))
  }
}

module.exports = homeController