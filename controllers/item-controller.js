const Item = require('../models/item')
const Category = require('../models/category')
const Unit = require('../models/unit')
const Record = require('../models/record')
const { currentYearMonDate } = require('../helpers/handlebars-helpers')

const itemController = {
  getSolven: (req, res) => {
    Item.find().populate(['categoryId', 'unitId']).lean().then(item => {
      const normalSolven = item.filter(obj => obj.categoryId.name === '一般溶劑')
      const percent = normalSolven.map(obj =>
        obj['percent'] = parseInt((obj.stock / obj.fullStock) * 100)
      )
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
  },
  getShopping: (req, res, next) => {
    Item.findById(req.params.id).populate('unitId').lean().then(item => {
      if (!item) throw new Error("User didn't exist!")
      res.render('item/shopping', { item })
    }).catch(err => next(err))
  },
  getObject: (req, res, next) => {
    Item.findById(req.params.id).populate('unitId').lean().then(item => {
      if (!item) throw new Error("User didn't exist!")
      res.render('item/get-object', { item })
    }).catch(err => next(err))
  },
  saveObject: (req, res, next) => {
    Item.findById(req.params.id).populate('unitId').lean().then(item => {
      if (!item) throw new Error("User didn't exist!")
      res.render('item/save-object', { item })
    }).catch(err => next(err))
  }, postObject: (req, res, next) => {
    Item.findById(req.params.id).populate('unitId').then(item => {
      if (!item) throw new Error("item didn't exist!")
      const { getNumber } = req.body
      item.stock -= getNumber
      if (item.stock < 0) throw new Error("庫存不足!")
      return item.save()
    }).then(item => {
      const { getNumber } = req.body
      if (!item) throw new Error("item didn't exist!")
      return Record.create({
        inputNumber: 0,
        outNumber: getNumber,
        createAt: currentYearMonDate(),
        itemId: item._id,
        userId: req.user._id
      })
    }).then(item => {
      if (!item) throw new Error("item didn't exist!")
      req.flash('success_messages', '領取成功')
      res.redirect('/item/normalSolven')
    }).catch(err => next(err))
  }
}

module.exports = itemController