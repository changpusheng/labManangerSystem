const express = require('express')
const router = express.Router()
const adminCroller = require('../../controllers/admin-controller')


router.delete('/itemUseRecord/:id', adminCroller.deleteItemUseRecord)
router.delete('/itemBuyRecord/:id', adminCroller.deleteItemBuyRecord)
router.patch('/users/:id', adminCroller.patchUser)
router.delete('/itemList/:id', adminCroller.deleteitemList)
router.post('/itemList/:id', adminCroller.postItemList)
router.get('/itemList/:id', adminCroller.getItemList)
router.delete('/users/:id', adminCroller.deleteUser)
router.get('/categories/:id', adminCroller.getCategories)
router.put('/categories/:id', adminCroller.putCategory)
router.delete('/categories/:id', adminCroller.deleteCategory)
router.get('/signup', adminCroller.getSignup)
router.post('/signup', adminCroller.postSignup)
router.get('/backside', adminCroller.getBackSide)
router.get('/itemList', adminCroller.getItemList)
router.get('/categories', adminCroller.getCategories)
router.post('/categories', adminCroller.postCategory)
router.get('/units', adminCroller.getUnits)
router.post('/units', adminCroller.postUnit)



module.exports = router