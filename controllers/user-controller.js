const User = require('../models/user')
const bcrypt = require('bcryptjs')

const userController = {
  getSignin: (req, res) => {
    res.render('users/signin')
  },
  getSignup: (req, res) => {
    res.render('users/signup')
  },
  postSignup: (req, res, next) => {
    const { name, account, password, confirmPassword } = req.body
    const error = []
    if (!name || !account || !password || !confirmPassword) {
      error.push({ message: '有空格' })
    }
    if (password !== confirmPassword) {
      error.push({ message: '密碼與確認密碼不同!' })
    }
    if (error.length) {
      return res.render('users/signup', {
        error,
        name,
        account,
        password,
        confirmPassword
      })
    }
    return User.findOne({ account }).then(user => {
      if (user) {
        err.push({ message: '帳號已註冊' })
        return res.render('users/signup', {
          error,
          name,
          account,
          password,
          confirmPassword
        })
      } else {
        return bcrypt.genSalt(10).then(salt => {
          return bcrypt.hash(password, salt)
        }).then(hash => {
          return User.create({
            name,
            account,
            password: hash
          })
        }).then(() =>res.redirect('/users/signin')).catch(err => next(err))
      }
    }).catch(err => next(err))
  }
}

module.exports = userController