const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars').engine
const methodOverride = require('method-override')
const router = require('./routes')
const flash = require('connect-flash')
const session = require('express-session')
require('./models/mongoose')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'paul',
  resave: false,
  saveUninitialized: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(express.static('public'))
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(router)
app.listen(port, () => {
  console.log(`The server on localhost:${port} running.`)
})