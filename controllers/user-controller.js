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
  }
}

module.exports = userController