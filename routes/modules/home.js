const express = require('express')
const router = express.Router()
const homeContriller = require('../../controllers/home-controller')

router.get('/', homeContriller.gethome)


module.exports = router