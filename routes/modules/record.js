const express = require('express')
const router = express.Router()
const recordContriller = require('../../controllers/record-controller')


router.get('/itemUseRecord', recordContriller.getItemUseRecord)
router.get('/itemBuyRecord', recordContriller.getItemBuyRecord)
router.get('/checkRecord', recordContriller.checkRecord)

module.exports = router