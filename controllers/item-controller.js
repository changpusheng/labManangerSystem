const Item = require('../models/item')

const itemController = {
  getSolven: (req, res) => {
    res.render('item/solven')
  },
  getToxicSolven: (req, res) => {
    res.render('item/toxic')
  },
  getCreateItem: (req, res) => {
    res.render('item/createItem')
  }
}

module.exports = itemController