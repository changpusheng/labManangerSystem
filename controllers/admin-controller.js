const adminCroller = {
  getUsers: (req, res, next) => {
    return res.render('admin/users')
  }
}

module.exports = adminCroller