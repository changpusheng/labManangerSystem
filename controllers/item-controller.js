const Item = require('../models/item')
const Category = require('../models/category')

const itemController = {
  getSolven: (req, res) => {
    res.render('item/solven')
  },
  getToxicSolven: (req, res) => {
    res.render('item/toxic')
  },
  getCreateItem: (req, res, next) => {
    Category.find().lean().then(categories => {
      if (!categories) throw new Error("Category didn't exist!")
      res.render('item/createItem', { categories })
    }
    ).catch(err => next(err))
  },
  postCreateItem: (req, res, next) => {
    const { categoryId, name, englishName, stock, safeStock, fullStock, casNumber
    } = req.body
    if (!categoryId || !name || !englishName || !stock || !safeStock || !fullStock || !casNumber) throw new Error('有空格')
    Item.findOne({ name }).then(name => {
      if (name) throw new Error('已經有該品項')
    }).then(() => {
      const userId = req.user._id
      Item.create({
        name,
        stock,
        safeStock,
        englishName,
        categoryId,
        fullStock,
        casNumber,
        unitId: userId
      })
    })
      .then(() => {
        req.flash('success_messages', '新增成功')
        res.redirect('/item/normalSolven')
      })
      .catch(err => next(err))
  }
}

module.exports = itemController