const db = require('../mongoose')
const Item = require('../item')
const Category = require('../category')
const Unit = require('../unit')


if (process.env.NODE.ENV !== 'production') {
  require('dotenv').config()
}


db.on('error', () => { console.log('mongoose error!') })

db.once('open', () => {
  return Promise.all([Category.find().lean(), Unit.find().lean()]).then(([category, unit]) => {
    let unitId
    let factorNumber
    for (let i = 0; i < 4; i++) {
      if (!i || i === 3) {
        unitId = unit[1]._id
        factorNumber = 1
      } else if (i === 1) {
        unitId = unit[0]._id
        factorNumber = 1
      } else {
        unitId = unit[2]._id
        factorNumber = 3.148
      }
      for (let j = 0; j < 41; j++) {
        Item.create({
          name: category[i].name + `${j}`,
          stock: 6,
          safeStock: 2,
          fullStock: 6,
          casNumber: `${j}` + 123 + `${i}`,
          englishName: 'Seed',
          factors: factorNumber,
          categoryId: category[i]._id,
          unitId: unitId
        }).catch(err => next(err))
      }
    }
  }).catch(err => next(err))
})