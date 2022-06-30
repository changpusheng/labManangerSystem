const originObjLabelPrintXlsx = require('../public/javascript/originObj')

const labelPrintContriller = {
  getOriginObj: (req, res) => {
    originObjLabelPrintXlsx()
    res.render('labelPrint/originObj')
  }
}

module.exports = labelPrintContriller