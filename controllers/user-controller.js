const userController = {
  getSignin: (req, res) => {
    res.render('users/signin')
  },
  getSignup: (req, res) => {
    res.render('users/signup')
  }
}

module.exports = userController