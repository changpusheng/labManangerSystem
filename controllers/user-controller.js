const userController = {
  getSignin: (req, res, next) => {
    res.render('users/signin')
  }
}

module.exports = userController