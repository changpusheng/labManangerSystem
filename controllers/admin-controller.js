const User = require('../models/user')
const Category = require('../models/category')
const bcrypt = require('bcryptjs')
const Unit = require('../models/unit')
const Record = require('../models/record')
const Item = require('../models/item')
const Buy = require('../models/buy')
const dayjs = require('dayjs')

const adminCroller = {
  getBackSide: (req, res, next) => {
    User.find().lean().then(users => {
      return res.render('admin/backside', { users })
    }).catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    return User.findById(req.params.id).then(user => {
      if (!user) throw new Error("User didn't exist!")
      if (user.account === '3fqc') {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
      if (user.isAdmin) {
        user.isAdmin = false
        return user.save()
      } else {
        user.isAdmin = true
        return user.save()
      }
    }).then(() => {
      req.flash('success_messages', '使用者權限變更成功')
      res.redirect('/admin/backside')
    }).catch(err => next(err))
  },
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
    Buy.findById(req.params.id).then(record => {
      if (!record) throw new Error('紀錄不存在')
      record.remove()
    }).then(() => {
      req.flash('success_messages', '刪除成功')
      res.redirect('/record/itemBuyRecord')
    }).catch(err => next(err))
  },
  getItemList: (req, res, next) => {
    return Promise.all([Item.find().populate(['categoryId', 'unitId']).lean(),
    req.params.id ? Item.findById(req.params.id).populate(['categoryId', 'unitId']).lean() : null,
    Category.find().lean(),
    Unit.find().lean()
    ]).then(([items, item, categories, units]) => {
      if (!items) throw new Error('沒有物件')
      res.render('admin/itemList', { items, item, categories, units })
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
  }
}

module.exports = adminCroller