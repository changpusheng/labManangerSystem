const User = require('../user')
const db = require('../mongoose')
const bcrypt = require('bcryptjs')

if (process.env.NODE.ENV !== 'production') {
  require('dotenv').config()
}

db.on('error', () => { console.log('mongoose error!') })

db.once('open', () => {
  bcrypt.genSalt(10).then(salt =>
    bcrypt.hash(process.env.user_Password, salt)
  ).then(hash =>
    User.create({
      name: process.env.user_Name,
      account: process.env.user_Account,
      email: process.env.user_Email,
      password: hash,
      isAdmin: true
    })
  ).catch(err => console.log(err))
})

