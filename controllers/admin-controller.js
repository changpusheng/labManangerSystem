const User = require('../models/user')
const Category = require('../models/category')
const bcrypt = require('bcryptjs')
const Unit = require('../models/unit')
const Record = require('../models/record')
const Item = require('../models/item')
const Buy = require('../models/buy')
const Config = require('../models/config')
const Instrument = require('../models/instrument')
const dayjs = require('dayjs')
const dimStringSearch = require('../public/javascript/dimStringSearch')
const { getOffset, getPagination } = require('../helpers/page-helper')

const adminCroller = {
  getBackSide: (req, res, next) => {
    User.find().lean().then(users => {
      return res.render('admin/backside', { users })
    }).catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    User.findById(req.params.id).then(user => {
      if (!user) throw new Error("User didn't exist!")
      if (user.account === '3fqc') {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
      user.isAdmin ? user.isAdmin = false : user.isAdmin = true
      user.save()
    }).then(() => {
      req.flash('success_messages', '權限變更成功')
      res.redirect('/admin/backside')
    }).catch(err => next(err))
  },
  patchToxicManager: (req, res, next) => {
    User.findById(req.params.id).then(user => {
      if (!user) throw new Error("User didn't exist!")
      if (user.account === '3fqc') {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
      user.isToxicManager ? user.isToxicManager = false : user.isToxicManager = true
      user.save()
    }).then(() => {
      req.flash('success_messages', '權限變更成功')
      res.redirect('/admin/backside')
    }).catch(err => next(err))
  }
  ,
  deleteUser: (req, res, next) => {
    return User.findById(req.params.id).then(user => {
      if (!user) throw new Error("User didn't exist!")
      if (user.account === '3fqc') {
        req.flash('error_messages', '禁止刪除 3fqc')
        return res.redirect('back')
      }
      user.remove()
    }).then(() => {
      req.flash('success_messages', '刪除成功')
      res.redirect('/admin/backside')
    }).catch(err => next(err))
  },
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.find().lean(),
      req.params.id ? Category.findById(req.params.id).lean() : null
    ]).then(([categories, category]) => {
      res.render('admin/category', {
        categories,
        category
      })
    }).catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('請輸入分類')
    Category.findOne({ name }).then(name => {
      if (name) throw new Error('已經有該分類名稱')
    }).then(() => {
      return Category.create({ name })
        .then(() => {
          req.flash('success_messages', '成功新增分類')
          res.redirect('/admin/categories')
        }).catch(err => next(err))
    }).catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('請輸入分類')
    return Category.findById(req.params.id).then(category => {
      if (!category) throw new Error("Category doesn't exist!")
      category.name = name
      return category.save()
    }).then(() => res.redirect('/admin/categories')).catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    return Category.findById(req.params.id).then(category => {
      if (!category) throw new Error("Category didn't exist!")
      return category.remove()
    }).then(() => res.redirect('/admin/categories')).catch(err => next(err))
  },
  getSignup: (req, res) => {
    res.render('users/signup')
  },
  postSignup: (req, res, next) => {
    const { email, name, account, password, confirmPassword } = req.body
    if (!email || !name || !account || !password || !confirmPassword) throw new Error('有空格')
    if (password !== confirmPassword) throw new Error('密碼與確認密碼不同!')
    User.findOne({ account }).then(user => {
      if (user) throw new Error('帳號已註冊!')
      return bcrypt.hash(password, 10)
    }).then(hash =>
      User.create({
        name,
        account,
        email,
        password: hash
      })
    ).then(() => {
      req.flash('success_messages', '成功註冊帳號！')
      res.redirect('/admin/backside')
    }).catch(err => next(err))
  },
  getUnits: (req, res, next) => {
    return Promise.all([Unit.find().lean(),
    req.params.id ? Unit.findById(req.params.id).lean() : null])
      .then(([units, unit]) => {
        res.render('admin/unit', { unit, units })
      }).catch(err => next(err))
  },
  postUnit: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('請輸入分類')
    Unit.findOne({ name }).then(name => {
      if (name) throw new Error('已經有該單位名稱')
    }).then(() => {
      return Unit.create({ name })
        .then(() => {
          req.flash('success_messages', '成功新增單位')
          res.redirect('/admin/units')
        }).catch(err => next(err))
    }).catch(err => next(err))
  },
  deleteItemUseRecord: (req, res, next) => {
    Record.findById(req.params.id).then(record => {
      if (!record) throw new Error('紀錄不存在')
      record.remove()
    }).then(() => {
      req.flash('success_messages', '刪除成功')
      res.redirect('/record/itemUseRecord')
    }).catch(err => next(err))
  },
  deleteItemBuyRecord: (req, res, next) => {
    Buy.findById(req.params.id).populate('itemId').then(record => {
      if (!record) throw new Error('紀錄不存在')
      record.itemId.isBuy = false
      record.itemId.save()
      return record.remove()
    }).then(record => {
      Buy.create({
        number: record.number,
        commit: record.commit,
        createAt: dayjs().format(),
        note: `${req.user
          .name}已經刪除訂單`,
        itemId: record.itemId._id,
        userId: record.userId._id,
        isDone: true
      }).catch(err => next(err))
    }).then(() => {
      req.flash('success_messages', '刪除成功')
      res.redirect('/record/itemBuyRecord')
    }).catch(err => next(err))
  },
  getItemList: (req, res, next) => {
    const DEFAULT_LIMIT = 100
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([Item.find().populate(['categoryId', 'unitId']).lean(),
    req.params.id ? Item.findById(req.params.id).populate(['categoryId', 'unitId']).lean() : null,
    Category.find().lean(),
    Unit.find().lean()
    ]).then(([items, item, categories, units]) => {
      if (!items) throw new Error('沒有物件')
      let keyWord = req.query.itemList
      let filterObj
      let getPaginationfn
      if (keyWord) {
        keyWord = req.query.itemList.trim().toLowerCase()
        const recordFileter = items.filter(obj => {
          const categoryObj = dimStringSearch(obj.categoryId.name, keyWord)
          const itemNameObj = dimStringSearch(obj.name, keyWord)
          const englishNameObj = dimStringSearch(obj.englishName, keyWord)
          const unitObj = dimStringSearch(obj.unitId.name, keyWord)
          return categoryObj || itemNameObj || englishNameObj || unitObj
        })
        filterObj = recordFileter.slice(offset, offset + limit)
        getPaginationfn = getPagination(limit, page, recordFileter.length)
      } else {
        filterObj = items.slice(offset, offset + limit)
        getPaginationfn = getPagination(limit, page, items.length)
      }
      res.render('admin/itemList', {
        items: filterObj, item, categories, units, keyWord, pagination: getPaginationfn
      })
    }).catch(err => next(err))
  },
  postItemList: (req, res, next) => {
    const { name, englishName, categoryId, casNumber, stock, safeStock, fullStock, unitId } = req.body
    Item.findById(req.params.id).then(item => {
      if (!item) throw new Error('此ID搜尋不到')
      item.name = name
      item.englishName = englishName
      item.categoryId = categoryId
      item.casNumber = casNumber
      item.stock = stock
      item.safeStock = safeStock
      item.fullStock = fullStock
      item.unitId = unitId
      return item.save()
    }).then(item => {
      if (!item) throw new Error('此ID搜尋不到')
      Record.create({
        inputNumber: 0,
        outNumber: 0,
        stockNumber: item.stock,
        createAt: dayjs().format(),
        note: '更改',
        itemId: req.params.id,
        userId: req.user._id,
        isCount: true
      }).catch(err => next(err))
    }).then(() => {
      req.flash('success_massages', '更改成功')
      res.redirect('/admin/itemList')
    }).catch(err => next(err))
  },
  deleteitemList: (req, res, next) => {
    Item.findById(req.params.id).then(item => {
      if (!item) throw new Error('此ID搜尋不到')
      return item.remove()
    }).then(() => {
      req.flash('success_messages', '刪除成功')
      res.redirect('/admin/itemList')
    }).catch(err => next(err))
  },
  getConfig: (req, res, next) => {
    Promise.all([
      Config.find().lean(),
      req.params.id ? Config.findById(req.params.id).lean() : null
    ])
      .then(([items, item]) => {
        res.render('admin/config', { items, item })
      }).catch(err => next(err))
  },
  putConfig: (req, res, next) => {
    const { data, name, note } = req.body
    if (!name) throw new Error('請輸入檔名')
    if (!data) throw new Error('請輸入日期')
    return Config.findById(req.params.id).then(config => {
      if (!config) throw new Error("config doesn't exist!")
      config.name = name
      config.data = data
      config.note = note
      return config.save()
    }).then(() => res.redirect('/admin/config')).catch(err => next(err))
  },
  postConfig: (req, res, next) => {
    const { data, name, note } = req.body
    if (!name) throw new Error('請輸入檔名')
    if (!data) throw new Error('請輸入日期')
    return Config.create({
      name,
      data, note
    }).then(() => res.redirect('/admin/config')).catch(err => next(err))
  }
  ,
  getInstrument: (req, res, next) => {
    const DEFAULT_LIMIT = 5
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([Instrument.find().lean(),
    req.params.id ? Instrument.findById(req.params.id).lean() : null
    ]).then(([instruments, instrument]) => {
      let keyWord = req.query.instrument
      let filterObj
      let getPaginationfn
      if (keyWord) {
        keyWord = req.query.instrument.trim().toLowerCase()
        const recordFileter = instruments.filter(obj => {
          const instrumentNameObj = dimStringSearch(obj.name, keyWord)
          return instrumentNameObj
        })
        filterObj = recordFileter.slice(offset, offset + limit)
        getPaginationfn = getPagination(limit, page, recordFileter.length)
      } else {
        filterObj = instruments.slice(offset, offset + limit)
        getPaginationfn = getPagination(limit, page, instruments.length)
      }
      return res.render('admin/instrument', {
        instruments: filterObj,
        instrument,
        pagination: getPaginationfn,
        keyWord
      })
    }).catch(err => next(err))
  },
  postInstrument: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('請輸入設備名稱')
    Instrument.findOne({ name: name.toUpperCase() }).then(name => {
      if (name) throw new Error('已經有該設備名稱')
    }).then(() => {
      return Instrument.create({ name: name.toUpperCase() })
        .then(() => {
          req.flash('success_messages', '新增設備成功')
          res.redirect('/admin/instrument')
        }).catch(err => next(err))
    }).catch(err => next(err))
  },
  putInstrument: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('請輸入設備名稱')
    return Instrument.findById(req.params.id).then(inst => {
      if (!inst) throw new Error(" 設備不存在!")
      inst.name = name
      return inst.save()
    }).then(() => res.redirect('/admin/instrument')).catch(err => next(err))
  },
  deleteInstrument: (req, res, next) => {
    return Instrument.findById(req.params.id).then(inst => {
      if (!inst) throw new Error("設備不存在!")
      return inst.remove()
    }).then(() => res.redirect('/admin/instrument')).catch(err => next(err))
  },
  patchInstrument: (req, res, next) => {
    Instrument.findById(req.params.id).then(inst => {
      if (!inst) throw new Error("User didn't exist!")
      inst.follow ? inst.follow = false : inst.follow = true
      inst.save()
    }).then(() => {
      req.flash('success_messages', '變更成功')
      res.redirect('/admin/instrument')
    }).catch(err => next(err))
  }
}

module.exports = adminCroller