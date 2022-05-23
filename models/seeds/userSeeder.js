const User = require('../user')
const db = require('../mongoose')
const bcrypt = require('bcryptjs')

if (process.env.NODE.ENV !== 'production') {
  require('dotenv').config()
}

db.on('error', () => { console.log('mongoose error!') })

db.once('open', () => {
  bcrypt.genSalt(10).then(salt =>
    bcrypt.hash(process.env.userPassword, salt)
  ).then(hash =>
    User.create({
      name: process.env.userName,
      account: process.env.userAccount,
      email: process.env.email,
      password: hash,
      isAdmin: true
    }).catch(err => console.log(err))
  ).catch(err => console.log(err))
})