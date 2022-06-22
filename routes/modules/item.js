const express = require('express')
const router = express.Router()
const itemController = require('../../controllers/item-controller')

router.patch('/category/:id', itemController.patchCategory)
router.post('/toxic-isCheck/:id', itemController.postToxicCheck)
router.post('/shopping-object/:id', itemController.postShopping)
router.get('/shopping-object/:id', itemController.getShopping)
router.post('/objectget/:id', itemController.postObjectGet)
router.get('/objectget/:id', itemController.getObjectGet)
router.post('/objectsave/:id', itemController.postObjectSave)
router.get('/objectsave/:id', itemController.getObjectSave)
router.put('/amount-check/:id', itemController.putCheckRecord)
router.get('/amount-check/:id', itemController.getCheckRecord)
router.post('/create', itemController.postCreateItem)
router.get('/amount-check', itemController.getCheckRecord)
router.get('/category', itemController.getCategory)
router.get('/create', itemController.getCreateItem)


module.exports = router