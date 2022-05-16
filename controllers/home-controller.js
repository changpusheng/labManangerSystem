const homeController = {
  gethome: (req, res, next) => {
    res.render('home')
  }
}

module.exports = homeController