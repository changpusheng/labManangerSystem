const User = require('../models/user')

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
      user.remove()
    }).then(() => {
      req.flash('success_messages', '刪除成功')
      res.redirect('/admin/backside')
    }).catch(err => next(err))
  }
}

module.exports = adminCroller