const User = require('../models/user')
const bcrypt = require('bcryptjs')

const userController = {
  getSignin: (req, res) => {
    res.render('users/signin')
  },
  postSignin: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/users/signin')
  },
  getSignup: (req, res) => {
    res.render('users/signup')
  },
  postSignup: (req, res, next) => {
    const { name, account, password, confirmPassword } = req.body
    if (!name || !account || !password || !confirmPassword) throw new Error('有空格')
    if (password !== confirmPassword) throw new Error('密碼與確認密碼不同!')
    User.findOne({ account }).then(user => {
      if (user) throw new Error('帳號已註冊!')
      return bcrypt.hash(password, 10)
    }).then(hash =>
      User.create({
        name,
        account,
        password: hash
      })
    ).then(() => {
      req.flash('success_messages', '成功註冊帳號！')
      res.redirect('/')
    }).catch(err => next(err))
  }
}

module.exports = userController