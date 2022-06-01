const db = require('../mongoose')
const Record = require('../record')
const Item = require('../item')
const User = require('../user')
const dayjs = require('dayjs')
const { currentDay } = require('../../helpers/handlebars-helpers')

if (process.env.NODE.ENV !== 'production') {
  require('dotenv').config()
}

db.on('error', () => { console.log('mongoose error!') })

db.once('open', () => {
  return Promise.all([Item.find().lean(), User.find().lean()]).then(([items, users]) => {
    let useNumber
    for (let i = 0; i <= 3; i++) {
      for (let j = 1; j <= 12; j++) {
        for (let k = 1; k <= 30; k++) {
          if (k % 2 === 0) {
            useNumber = 1 + i
          } else if (k % 3 === 0) {
            useNumber = 3 - i
          } else {
            useNumber = 2
          }
          let year = 2018 + i
          Record.create({
            inputNumber: 0,
            outNumber: useNumber,
            stockNumber: 500 - 2,
            createAt: dayjs(`${year}-${j}-${k}`).format(),
            itemId: items[i]._id,
            userId: users[1]._id
          }).catch(err => console.log(err))
        }
      }
    }
  }).catch(err => console.log(err))
})