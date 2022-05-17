const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.post('/signup', userController.postSignup)
router.get('/signin', userController.getSignin)
router.get('/signup', userController.getSignup)


module.exports = router