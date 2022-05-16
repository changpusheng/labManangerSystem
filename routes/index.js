const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')


router.use('/', home)
router.use('/admin', admin)
router.use(generalErrorHandler)
module.exports = router