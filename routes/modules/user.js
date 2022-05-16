const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/signin', userController.getSignin)

module.exports = router