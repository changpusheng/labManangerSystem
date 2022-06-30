const express = require('express')
const router = express.Router()
const labelPrintContriller = require('../../controllers/labelPrint-controller')

router.get('/', labelPrintContriller.getOriginObj)



module.exports = router