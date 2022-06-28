const Instrument = require('../models/instrument')
const InstrumentRecord = require('../models/instrumentRecord')
const dayjs = require('dayjs')

const instrumentContriller = {
  getInstrument: (req, res, next) => {
    Promise.all([Instrument.find({
      $and: [{ follow: true }, { checkState: false }]
    }).lean(),
    InstrumentRecord.find().populate(['instrumentId', 'userId']).lean()
    ]).then(([instruments, records]) => {
      res.render('instrument/instrument', {
        instruments, records
      })
    }).catch(err => next(err))
  },
  postOpenInstrument: (req, res, next) => {
    Instrument.findById(req.params.id).then(instrument => {
      instrument.checkState = true
      instrument.isOpen = true
      return instrument.save()
    }).then(obj => {
      InstrumentRecord.create({
        instrumentId: obj._id,
        userId: req.user._id,
        createAt: dayjs().format(),
        isOpen: true
      })
    }).then(() => {
      res.redirect('/instrument')
    }).catch(err => next(err))
  },
  postCloseInstrument: (req, res, next) => {
    Instrument.findById(req.params.id).then(instrument => {
      instrument.checkState = true
      instrument.isOpen = false
      return instrument.save()
    }).then(obj => {
      InstrumentRecord.create({
        instrumentId: obj._id,
        userId: req.user._id,
        createAt: dayjs().format(),
        isClose: true
      })
    }).then(() => {
      res.redirect('/instrument')
    }).catch(err => next(err))
  }
}

module.exports = instrumentContriller