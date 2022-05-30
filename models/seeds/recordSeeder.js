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
    for (let j = 0; j <= 2; j++) {
      for (let i = 1; i <= 30; i++) {
        if (i % 2 === 0) {
          Record.create({
            inputNumber: 0,
            outNumber: 0 + i + j,
            stockNumber: 0 + i + j,
            createAt: dayjs(`2018-06-${i}`).format(),
            itemId: items[j]._id,
            userId: users[0]._id
          }).catch(err => console.log(err))
        } else {
          Record.create({
            inputNumber: 0,
            outNumber: 40 - i - j,
            stockNumber: 40 - i - j,
            createAt: dayjs(`2018-06-${i}`).format(),
            itemId: items[j]._id,
            userId: users[0]._id
          }).catch(err => console.log(err))
        }
      }
    }
  }).catch(err => console.log(err))
})