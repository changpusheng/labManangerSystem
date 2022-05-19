const Item = require('../models/item')
const Category = require('../models/category')
const Unit = require('../models/unit')

const itemController = {
  getSolven: (req, res) => {
    Item.find().populate('categoryId').lean().then(item => {
      const normalSolven = item.filter(obj => obj.categoryId.name === '一般溶劑')
      res.render('item/solven', {
        normalSolven
      })
    })
  },
  getToxicSolven: (req, res) => {
    res.render('item/toxic')
  },
  getCreateItem: (req, res, next) => {
    return Promise.all([Category.find().lean(), Unit.find().lean()]).then(([categories, units]) => {
      if (!categories || !units) throw new Error("Category/unit didn't exist!")
      res.render('item/createItem', { categories, units })
    }).catch(err => next(err))
  },
  postCreateItem: (req, res, next) => {
    const { unitId, categoryId, name, englishName, stock, safeStock, fullStock, casNumber
    } = req.body
    if (!name || !englishName || !stock || !safeStock || !fullStock || !casNumber) throw new Error('有空格')
    if (!unitId || !categoryId) throw new Error('沒有選擇分類')
    Item.findOne({ name }).then(name => {
      if (name) throw new Error('已經有該品項')
    }).then(() => {
      Item.create({
        name,
        stock,
        safeStock,
        englishName,
        categoryId,
        fullStock,
        casNumber,
        unitId
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