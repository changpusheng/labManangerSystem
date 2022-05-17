const express = require('express')
const router = express.Router()
const adminCroller = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/users', authenticatedAdmin, adminCroller.getBackSide)

module.exports = router