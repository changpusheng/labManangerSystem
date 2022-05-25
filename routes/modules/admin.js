const express = require('express')
const router = express.Router()
const adminCroller = require('../../controllers/admin-controller')


router.delete('/itemUseRecord/:id', adminCroller.deleteItemUseRecord)
router.patch('/users/:id', adminCroller.patchUser)
router.delete('/users/:id', adminCroller.deleteUser)
router.get('/categories/:id', adminCroller.getCategories)
router.put('/categories/:id', adminCroller.putCategory)
router.delete('/categories/:id', adminCroller.deleteCategory)
router.get('/signup', adminCroller.getSignup)
router.post('/signup', adminCroller.postSignup)
router.get('/backside', adminCroller.getBackSide)
router.get('/categories', adminCroller.getCategories)
router.post('/categories', adminCroller.postCategory)
router.get('/units', adminCroller.getUnits)
router.post('/units', adminCroller.postUnit)



module.exports = router