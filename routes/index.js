const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const admin = require('./modules/admin')
const user = require('./modules/user')
const item = require('./modules/item')
const record = require('./modules/record')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')
const { authenticatedAdmin } = require('../middleware/auth')

router.use('/item', authenticated, item)
router.use('/record', authenticated, record)
router.use('/users', user)
router.use('/', home)
router.use('/admin', authenticatedAdmin, admin)
router.use('/', generalErrorHandler)

module.exports = router