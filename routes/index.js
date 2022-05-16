const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const admin = require('./modules/admin')
const user = require('./modules/user')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/users', user)
router.use('/', home)
router.use('/admin', admin)

module.exports = router