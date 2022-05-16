const userController = {
  getSignin: (req, res, next) => {
    res.render('signin')
  }
}

module.exports = userController