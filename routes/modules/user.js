const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const passport = require('../../config/passport')
const { authenticated } = require('../../middleware/auth')


router.post('/signin', passport.authenticate('local', { failureRedirect: '/users/signin', failureFlash: true }), userController.postSignin)
router.get('/logout', authenticated, userController.logout)
router.get('/signin', userController.getSignin)


module.exports = router