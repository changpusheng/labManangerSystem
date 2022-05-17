const adminCroller = {
  getBackSide: (req, res, next) => {
    return res.render('admin/backside')
  }
}

module.exports = adminCroller