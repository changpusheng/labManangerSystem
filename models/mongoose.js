const mongoose = require('mongoose')
const mongooseURI = process.env.mongooseURI || 'mongodb://localhost/labItemManagerDB'
mongoose.connect(mongooseURI)
const db = mongoose.connection

db.on('error', () => console.log('mongoose error:' + error))

db.once('open', () => console.log('mongoose connected!'))

module.exports = db