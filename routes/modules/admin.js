const express = require('express')
const router = express.Router()
const adminCroller = require('../../controllers/admin-controller')


router.get('/backside', adminCroller.getBackSide)
router.patch('/users/:id', adminCroller.patchUser)
router.delete('/users/:id', adminCroller.deleteUser)

module.exports = router