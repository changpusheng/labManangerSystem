const express = require('express')
const router = express.Router()
const instrumentContriller = require('../../controllers/instrument-controller')

router.post('/fix/:id', instrumentContriller.postFixInstrument)
router.post('/open/:id', instrumentContriller.postOpenInstrument)
router.post('/close/:id', instrumentContriller.postCloseInstrument)
router.get('/', instrumentContriller.getInstrument)



module.exports = router