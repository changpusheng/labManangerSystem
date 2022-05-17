const Item = require('../models/item')

const itemController = {
  getSolven: (req, res) => {
    res.render('solven')
  },
  getToxicSolven: (req, res) => {
    res.render('toxic')
  }
}

module.exports = itemController