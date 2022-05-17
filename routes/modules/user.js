const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const passport = require('../../config/passport')


router.post('/signup', userController.postSignup)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/users/signin', failureFlash: true }), userController.postSignin)
router.get('/logout', userController.logout)
router.get('/signin', userController.getSignin)
router.get('/signup', userController.getSignup)


module.exports = router