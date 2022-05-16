const express = require('express')
const router = express.Router()
const adminCroller = require('../../controllers/admin-controller')

router.get('/users', adminCroller.getUsers)

module.exports = router