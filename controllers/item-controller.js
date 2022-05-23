const Item = require('../models/item')
const Category = require('../models/category')
const Unit = require('../models/unit')
const Record = require('../models/record')
const Buy = require('../models/buy')
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
    return Promise.all([Item.findById(req.params.id).populate('unitId').lean(), Buy.find().populate(['itemId', 'userId'])])
      .then(([item, buy]) => {
        if (!item) throw new Error("item didn't exist!")
        const buyIsDone = buy.filter(obj => obj.isDone === false)
        const buyItemId = buyIsDone.filter(obj => obj.itemId._id.toJSON() === item._id.toJSON())
        let buyItemIdtoJSON = JSON.stringify(buyItemId)
        res.render('item/shopping', {
          item, buyItemId, buyItemIdtoJSON
        })
      }).catch(err => next(err))
  },
  postShopping: (req, res, next) => {
    Item.findById(req.params.id).then(item => {
      if (!item) throw new Error("item didn't exist!")
      const { number, commit
      } = req.body
      if (!number) throw new Error('購買數量不能空白')
      Buy.find().populate('itemId').then(buy => {
        const buyIsDone = buy.filter(obj => obj.isDone === false)
        const buyNewArr = buyIsDone.map(obj => obj.itemId._id.toJSON())
        if (buyNewArr.includes(item._id.toJSON())) throw new Error('有訂單未結案')
      }).then(() => {
        Item.findById(req.params.id).then(item => {
          item.isBuy = true
          return item.save()
        }).catch(err => next(errs))
      }).then(() => {
        return Buy.create({
          number,
          createAt: currentYearMonDate(),
          commit,
          itemId: item._id,
          userId: req.user._id
        }).then(item => {
          console.log(item)
          req.flash('success_messages', '新增訂單')
          res.redirect('/')
        }).catch(err => next(err))
      }).catch(err => next(err))

    }).catch(err => next(err))
  },
  getObjectSave: (req, res, next) => {
    return Promise.all([Item.findById(req.params.id).populate('unitId').lean(), Buy.find().populate(['itemId', 'userId'])])
      .then(([item, buy]) => {
        if (!item) throw new Error("item didn't exist!")
        if (!buy) throw new Error("item didn't exist!")
        const buyIsDone = buy.filter(obj => obj.isDone === false)
        const buyItemId = buyIsDone.filter(obj => obj.itemId._id.toJSON() === item._id.toJSON())
        let latelyObj
        if (!buyItemId[0]) {
          latelyObj = []
        } else (
          latelyObj = buyItemId.slice(-1)[0].toJSON()
        )
        let buyItemIdtoJSON = JSON.stringify(buyItemId)
        res.render('item/save-object', {
          item, latelyObj, buyItemId, buyItemIdtoJSON
        })
      }).catch(err => next(err))
  },
  postObjectSave: (req, res, next) => {
    let note
    return Promise.all([Item.findById(req.params.id).populate('unitId'), Buy.find().populate(['itemId', 'userId'])])
      .then(([item, buy]) => {
        if (!item) throw new Error("item didn't exist!")
        if (!buy) throw new Error("Buyitem didn't exist!")
        const buyIsDone = buy.filter(obj => obj.isDone === false)
        const buyItemId = buyIsDone.filter(obj => obj.itemId._id.toJSON() === item._id.toJSON())
        const { saveNumber, otherNumber
        } = req.body
        let saveNumberValue = saveNumber
        if (!saveNumber) throw new Error("請選擇項目")
        if (saveNumber === 'other') {
          if (!otherNumber) throw new Error("入庫數量未填")
          saveNumberValue = otherNumber
        }
        item.stock += Number(saveNumberValue)
        if (buyItemId) {
          Buy.findById(buyItemId[0]._id.toJSON()).then(obj => {
            obj.isDone = true
            obj.save()
            req.flash('success_messages', `單號${obj.commit}結案`)
            note = `單號${obj.commit}結案`
          })
        }
        return item.save()
      }).then(item => {
        if (!item) throw new Error("item didn't exist!")
        const { saveNumber, otherNumber
        } = req.body
        let saveNumberValue = saveNumber
        if (saveNumber === 'other') {
          if (!otherNumber) throw new Error("入庫數量未填")
          saveNumberValue = otherNumber
        }
        return Record.create({
          inputNumber: saveNumberValue,
          outNumber: 0,
          createAt: currentYearMonDate(),
          itemId: item._id,
          userId: req.user._id,
          note
        }).then(() => {
          req.flash('success_messages', '入庫成功')
          res.redirect('/item/normalSolven')
        }).catch(err => next(err))
      }).catch(err => next(err))
  },
  getObjectGet: (req, res, next) => {
    Item.findById(req.params.id).populate('unitId').lean().then(item => {
      if (!item) throw new Error("User didn't exist!")
      res.render('item/get-object', { item })
    }).catch(err => next(err))
  },
  postObjectGet: (req, res, next) => {
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
      }).then(() => {
        req.flash('success_messages', '領取成功')
        res.redirect('/item/normalSolven')
      }).catch(err => next(err))
    }).catch(err => next(err))
  }
}

module.exports = itemController