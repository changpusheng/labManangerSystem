const Instrument = require('../models/instrument')
const InstrumentRecord = require('../models/instrumentRecord')

const instrumentContriller = {
  getInstrument: (req, res, next) => {
    Promise.all([
      Instrument.find({ follow: true }).lean(),
      req.params.id ? Instrument.findById(req.params.id).lean() : null
    ]).then(([instruments, instrument]) => {
      res.render('instrument/instrument', {
        instruments, instrument
      })
    }).catch(err => next(err))
  }
}

module.exports = instrumentContriller