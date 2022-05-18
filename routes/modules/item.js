const express = require('express')
const router = express.Router()
const itemController = require('../../controllers/item-controller')

router.get('/normalSolven', itemController.getSolven)
router.get('/toxic', itemController.getToxicSolven)
router.get('/create', itemController.getCreateItem)

module.exports = router