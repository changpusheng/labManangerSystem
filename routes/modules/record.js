const express = require('express')
const router = express.Router()
const recordContriller = require('../../controllers/record-controller')


router.get('/itemUseRecord', recordContriller.getItemUseRecord)
router.get('/itemBuyRecord', recordContriller.getItemBuyRecord)

module.exports = router