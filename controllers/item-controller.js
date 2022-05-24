const Item = require('../models/item')
const Category = require('../models/category')
const Unit = require('../models/unit')
const Record = require('../models/record')
const Buy = require('../models/buy')
const { currentYearMonDate } = require('../helpers/handlebars-helpers')

const itemController = {
  getSolven: (req, res, next) => {
    Item.find().populate(['categoryId', 'unitId']).lean().then(item => {
      const normalSolven = item.filter(obj => obj.categoryId.name === '一般溶劑')
      normalSolven.map(obj => {
        if (!obj.fullStock) {
          obj.fullStock = 0.1
        }
        obj['percent'] = parseInt((Number(obj.stock) / Number(obj.fullStock)) * 100)
      }
      )
      //排序由小到大 讓低水位的在前
      const normalSolvenSort = normalSolven.sort(function (a, b) {
        if (a.percent > b.percent) return 1
        if (a.percent < b.percent) return -1
        return 0
      })
      res.render('item/solven', {
        normalSolven: normalSolvenSort
      })
    }).catch(err => next(err))
  },
  getToxicSolven: (req, res, next) => {
    Item.find().populate(['categoryId', 'unitId']).lean().then(item => {
      const toxicSolven = item.filter(obj => obj.categoryId.name === '毒化物')
      toxicSolven.map(obj => {
        if (!obj.fullStock) {
          obj.fullStock = 0.1
        }
        obj['percent'] = parseInt((Number(obj.stock) / Number(obj.fullStock)) * 100)
      })
      //排序由小到大 讓低水位的在前
      const toxicSolvenSort = toxicSolven.sort(function (a, b) {
        if (a.percent > b.percent) return 1
        if (a.percent < b.percent) return -1
        return 0
      })
      res.render('item/toxic', {
        toxicSolven: toxicSolvenSort
      })
    }).catch(err => next(err))
  },
  getConsumablesGC: (req, res, next) => {
    Item.find().populate(['categoryId', 'unitId']).lean().then(item => {
      const consumablesGC = item.filter(obj => obj.categoryId.name === 'GC耗材')
      consumablesGC.map(obj => {
        if (!obj.fullStock) {
          obj.fullStock = 0.1
        }
        obj['percent'] = parseInt((Number(obj.stock) / Number(obj.fullStock)) * 100)
      })
      //排序由小到大 讓低水位的在前
      const consumablesGCSort = consumablesGC.sort(function (a, b) {
        if (a.percent > b.percent) return 1
        if (a.percent < b.percent) return -1
        return 0
      })
      res.render('item/consumablesGC', {
        consumablesGC: consumablesGCSort
      })
    }).catch(err => next(err))
  },
  getConsumablesLC: (req, res, next) => {
    Item.find().populate(['categoryId', 'unitId']).lean().then(item => {
      const consumablesLC = item.filter(obj => obj.categoryId.name === 'LC耗材')
      consumablesLC.map(obj => {
        if (!obj.fullStock) {
          obj.fullStock = 0.1
        }
        obj['percent'] = parseInt((Number(obj.stock) / Number(obj.fullStock)) * 100)
      }
      )
      //排序由小到大 讓低水位的在前
      const consumablesLCSort = consumablesLC.sort(function (a, b) {
        if (a.percent > b.percent) return 1
        if (a.percent < b.percent) return -1
        return 0
      })
      res.render('item/consumablesLC', {
        consumablesLC: consumablesLCSort
      })
    }).catch(err => next(err))
  },
  getCreateItem: (req, res, next) => {
    return Promise.all([Category.find().lean(), Unit.find().lean()]).then(([categories, units]) => {
      if (!categories || !units) throw new Error("Category/unit didn't exist!")
      res.render('item/createItem', { categories, units })
    }).catch(err => next(err))
  },
  postCreateItem: (req, res, next) => {
    const { otherFactorsValue, factors, unitId, categoryId, name, englishName, stock, safeStock, casNumber
    } = req.body
    if (!factors || !name || !englishName || !stock || !safeStock || !casNumber) throw new Error('有空格')
    if (!unitId || !categoryId) throw new Error('沒有選擇分類')

    let factorValue = factors
    if (!factors) throw new Error("請選擇項目")
    if (factors === 'other') {
      if (!otherFactorsValue) throw new Error("入庫數量未填")
      factorValue = otherFactorsValue
    }
    Item.findOne({ name }).then(obj => {
      if (obj) throw new Error('已經有該品項')
    }).then(() => {
      Item.create({
        name,
        stock: stock * Number(factorValue),
        safeStock: safeStock * Number(factorValue),
        englishName,
        categoryId,
        fullStock: stock * Number(factorValue),
        casNumber,
        unitId,
        factors: Number(factorValue)
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
        }).then(() => {
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
    let note = '無單號'
    let buyId
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
        if (buyItemId[0]) {
          let latelyObj = buyItemId.slice(-1)[0]
          item.stock += Number(saveNumberValue)
          item.isBuy = false
          item.fullStock = item.stock
          Buy.findById(latelyObj._id.toJSON()).then(obj => {
            obj.isDone = true
            obj.save()
            buyId = obj._id
            if (saveNumber === 'other') {
              if (otherNumber) {
                req.flash('success_messages', `單號${obj.commit}結案,其他選項:${saveNumberValue}${item.unitId.name}`)
                note = `單號${obj.commit}結案,其他選項:${saveNumberValue}${item.unitId.name}`
              }
            } else {
              req.flash('success_messages', `單號${obj.commit}結案`)
              note = `單號${obj.commit}結案`
            }
          })
        }
        item.stock += Number(saveNumberValue)
        item.isBuy = false
        item.fullStock = item.stock
        if (!buyItemId[0]) {
          req.flash('success_messages', '無購買單號')
        }
        return item.save()
      }).then(item => {
        if (!item) throw new Error("item didn't exist!")
        const { saveNumber, otherNumber
        } = req.body
        let saveNumberValue = Number(saveNumber)
        if (saveNumber === 'other') {
          if (!otherNumber) throw new Error("入庫數量未填")
          saveNumberValue = Number(otherNumber)
        }
        return Record.create({
          inputNumber: saveNumberValue,
          outNumber: 0,
          createAt: currentYearMonDate(),
          itemId: item._id,
          userId: req.user._id,
          note,
          buyId
        }).then(() => {
          req.flash('success_messages', '入庫成功')
          res.redirect('/')
        }).catch(err => next(err))
      }).catch(err => next(err))
  },
  getObjectGet: (req, res, next) => {
    Item.findById(req.params.id).populate('unitId').lean().then(item => {
      if (!item) throw new Error("User didn't exist!")
      res.render('item/get-object', {
        item
      })
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
        res.redirect('/')
      }).catch(err => next(err))
    }).catch(err => next(err))
  }
}

module.exports = itemController