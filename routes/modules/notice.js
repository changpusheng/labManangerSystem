const express = require('express')
const router = express.Router()
const noticeController = require('../../controllers/alertnotice-controller')

router.get('/', noticeController.getdata)

module.exports = router