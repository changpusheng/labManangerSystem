const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const admin = require('./modules/admin')
const user = require('./modules/user')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.use('/users', user)
router.use('/', authenticated, home)
router.use('/admin', admin)
router.use('/', generalErrorHandler)

module.exports = router