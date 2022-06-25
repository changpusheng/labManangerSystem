const express = require('express')
const router = express.Router()
const instrumentContriller = require('../../controllers/instrument-controller')


router.get('/', instrumentContriller.getInstrument)



module.exports = router