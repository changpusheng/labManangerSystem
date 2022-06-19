const Item = require('../models/item')
const Category = require('../models/category')
const Unit = require('../models/unit')
const Record = require('../models/record')
const Buy = require('../models/buy')
const Check = require('../models/check')
const dayjs = require('dayjs')
const sentEmail = require('../public/javascript/email')
const { currentYearMonDate } = require('../helpers/handlebars-helpers')
const { getOffset, getPagination } = require('../helpers/page-helper')
const dimStringSearch = require('../public/javascript/dimStringSearch')


const itemController = {
  getCategory: (req, res, next) => {
    const categoryId = req.query.categoryId || ''
    const DEFAULT_LIMIT = 12
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    let keyWord = req.query.search
    if (keyWord) {
      keyWord = req.query.search.trim().toLowerCase()
    }
    const reg = RegExp(keyWord, 'i')
    Promise.all([Item.find(req.query.search ? { $or: [{ name: reg }, { englishName: reg }, { casNumber: reg }] } : null).populate(['categoryId', 'unitId']).lean(),
    Category.find().lean()
    ])
      .then(([item, categories]) => {
        let categoryObj
        if (!categoryId) {
          categoryObj = item
        } else {
          categoryObj = item.filter(obj => {
            const objIdToJSON = obj.categoryId._id.toJSON()
            return objIdToJSON === req.query.categoryId
          })
        }
        categoryObj.map(obj => {
          if (!obj.fullStock) {
            obj.fullStock = 0.1
          }
          obj['percent'] = parseInt((Number(obj.stock) / Number(obj.fullStock)) * 100)
        })

        //排序由小到大 讓低水位的在前
        const itemSort = categoryObj.sort(function (a, b) {
          if (a.percent > b.percent) return 1
          if (a.percent < b.percent) return -1
          return 0
        }).slice(offset, offset + limit)
        res.render('item/category', {
          itemSort,
          categoryId,
          categories,
          keyWord,
          pagination: getPagination(limit, page, categoryObj.length),
          totalCount: categoryObj.length
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
        res.redirect('/')
      })
      .catch(err => next(err))
  },
  getShopping: (req, res, next) => {
    return Promise.all([Item.findById(req.params.id).populate(['categoryId', 'unitId']).lean(), Buy.find().populate(['itemId', 'userId'])])
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
        const buyisDone = buy.filter(obj => obj.isDone === false)
        const buyNewArr = buyisDone.map(obj => obj.itemId._id.toJSON())
        if (buyNewArr.includes(item._id.toJSON())) throw new Error('有訂單未結案')
      }).then(() => {
        Item.findById(req.params.id).then(item => {
          item.isBuy = true
          return item.save()
        }).catch(err => next(err))
      }).then(() => {
        return Buy.create({
          number,
          createAt: dayjs().format(),
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
    return Promise.all([Item.findById(req.params.id).populate(['categoryId', 'unitId']).lean(), Buy.find().populate(['itemId', 'userId'])])
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
    let stock
    return Promise.all([Item.findById(req.params.id).populate('unitId'), Buy.find().populate(['itemId', 'userId'])])
      .then(([item, buy]) => {
        if (!item) throw new Error("item didn't exist!")
        if (!buy) throw new Error("Buyitem didn't exist!")
        stock = item.stock
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
          //如果有購買單號
          let latelyObj = buyItemId.slice(-1)[0]
          item.isBuy = false
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
        const { saveNumber, otherNumber, note
        } = req.body
        let saveNumberValue = Number(saveNumber)
        if (saveNumber === 'other') {
          if (!otherNumber) throw new Error("入庫數量未填")
          saveNumberValue = Number(otherNumber)
        }
        return Record.create({
          inputNumber: saveNumberValue,
          outNumber: 0,
          createAt: dayjs().format(),
          itemId: item._id,
          userId: req.user._id,
          note,
          stockNumber: Number(stock) + saveNumberValue,
          buyId
        }).then(() => {
          req.flash('success_messages', '入庫成功')
          res.redirect('/')
        }).catch(err => next(err))
      }).catch(err => next(err))
  },
  getObjectGet: (req, res, next) => {
    Item.findById(req.params.id).populate(['categoryId', 'unitId']).lean().then(item => {
      if (!item) throw new Error("User didn't exist!")
      res.render('item/get-object', {
        item
      })
    }).catch(err => next(err))
  },
  postObjectGet: (req, res, next) => {
    let stock
    Item.findById(req.params.id).populate('unitId').then(item => {
      if (!item) throw new Error("item didn't exist!")
      stock = item.stock
      const { getNumber } = req.body
      item.stock -= getNumber
      if (item.stock < 0) throw new Error("庫存不足!")
      return item.save()
    }).then(item => {
      const { getNumber } = req.body
      if (!item) throw new Error("item didn't exist!")
      return Record.create({
        inputNumber: 0,
        outNumber: Number(getNumber),
        createAt: dayjs().format(),
        itemId: item._id,
        stockNumber: Number(stock) - Number(getNumber),
        userId: req.user._id
      }).then(item => {
        Item.findById(req.params.id).populate('categoryId').lean().then(obj => {
          if (obj.categoryId.name === '毒化物') {
            const titleContent = `${req.user.name}領用${item.outNumber}kg,ACN剩餘庫存${item.stockNumber.toFixed(3)}kg(無內文)`
            sentEmail(titleContent)
            item.isInform = true
            item.save()
          }
        }).catch(err => next(err))
        return item
      }).then(obj => {
        Item.findById(obj.itemId._id.toJSON()).populate('unitId').lean().then(item => {
          req.flash('success_messages', `成功領取-${item.name}${obj.outNumber
            }${item.unitId.name}`)
          res.redirect('/')
        })
      }).catch(err => next(err))
    }).catch(err => next(err))
  },
  postToxicCheck: (req, res, next) => {
    Record.findById(req.params.id).then(obj => {
      if (!obj) throw new Error('紀錄ID不存在')
      if (!obj.isCheck) {
        obj.isCheck = true
        req.flash('success_messages', `單號${req.params.id}確認完成`)
        return obj.save()
      } else {
        req.flash('warning_msg', `單號${req.params.id}已經確認`)
      }
    }).then(() => {
      res.redirect('/')
    }).catch(err => next(err))
  },
  getCheckRecord: (req, res, next) => {
    Promise.all([Item.find({ amountCheck: false }).populate('categoryId').lean(),
    req.params.id ? Item.findById(req.params.id).populate('categoryId').lean() : null,
    Check.find().populate(['itemId', 'userId']).lean().sort({ createAt: -1 })])
      .then(([checkItems, checkItem, checkObj]) => {
        const checkObjFilter = checkObj.filter(obj => {
          return dayjs(obj.createAt).format('YYYY/MM/DD') === dayjs().format('YYYY/MM/DD')
        })
        res.render('item/amount-check', {
          checkItems,
          checkItem,
          checkObj: checkObjFilter
        })
      }).catch(err => next(err))
  },
  putCheckRecord: (req, res, next) => {
    Item.findById(req.params.id).populate('categoryId').then(item => {
      let beforeNumber = item.stock
      const { afterNumber } = req.body
      if (afterNumber < 0) throw new Error('數量需為正數')
      item.stock = afterNumber
      item.amountCheck = true
      item.save()
      Check.create({
        amountBefore: beforeNumber,
        amountAfter: afterNumber,
        userId: req.user._id,
        itemId: req.params.id,
        createAt: dayjs().format(),
        nextTime: dayjs().add(14, 'day').format()
      }).then(() => {
        req.flash('success_messages', `${item.name}盤點完成`)
        res.redirect('/item/amount-check')
      }).catch(err => next(err))
    })
  }
}

module.exports = itemController