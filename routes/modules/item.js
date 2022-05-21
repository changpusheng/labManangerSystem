const express = require('express')
const router = express.Router()
const itemController = require('../../controllers/item-controller')

router.get('/shopping-object/:id', itemController.getShopping)
router.post('/shopping-object/:id', itemController.postShopping)
router.get('/get-object/:id', itemController.getObject)
router.post('/get-object/:id', itemController.postObject)
router.get('/save-object/:id', itemController.saveObject)
router.post('/create', itemController.postCreateItem)
router.get('/normalSolven', itemController.getSolven)
router.get('/toxic', itemController.getToxicSolven)
router.get('/create', itemController.getCreateItem)


module.exports = router