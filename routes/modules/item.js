const express = require('express')
const router = express.Router()
const itemController = require('../../controllers/item-controller')

router.post('/toxic-isCheck/:id', itemController.postToxicCheck)
router.post('/shopping-object/:id', itemController.postShopping)
router.get('/shopping-object/:id', itemController.getShopping)
router.post('/objectget/:id', itemController.postObjectGet)
router.get('/objectget/:id', itemController.getObjectGet)
router.post('/objectsave/:id', itemController.postObjectSave)
router.get('/objectsave/:id', itemController.getObjectSave)
router.post('/create', itemController.postCreateItem)
router.get('/consumablesLC', itemController.getConsumablesLC)
router.get('/consumablesGC', itemController.getConsumablesGC)
router.get('/normalSolven', itemController.getSolven)
router.get('/toxic', itemController.getToxicSolven)
router.get('/create', itemController.getCreateItem)


module.exports = router