const Instrument = require('../models/instrument')
const InstrumentRecord = require('../models/instrumentRecord')
const dayjs = require('dayjs')
const dimStringSearch = require('../public/javascript/dimStringSearch')

const instrumentContriller = {
  getInstrument: (req, res, next) => {
    Promise.all([Instrument.find({
      $and: [{ follow: true }, { checkState: false }]
    }).lean(),
    InstrumentRecord.find().populate(['instrumentId', 'userId']).lean()
    ]).then(([instruments, records]) => {
      let keyWord = req.query.search
      if (keyWord === '') throw new Error('請輸入關鍵字')
      let checkObjFilter
      if (keyWord) {
        keyWord = req.query.search.trim().toLowerCase()
        checkObjFilter = records.filter(obj => {
          const createDate = dimStringSearch(dayjs(obj.createAt).format('YYYY/MM/DD'), keyWord)
          const name = dimStringSearch(obj.instrumentId.name, keyWord)
          return createDate || name
        })
      } else {
        checkObjFilter = records.filter(obj => {
          return dayjs(obj.createAt).format('YYYY/MM/DD') === dayjs().format('YYYY/MM/DD')
        })
      }
      res.render('instrument/instrument', {
        instruments, records, keyWord,
        checkObjFilter
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