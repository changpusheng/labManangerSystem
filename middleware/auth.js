const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/users/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/users/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}