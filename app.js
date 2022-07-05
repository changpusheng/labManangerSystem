const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars').engine
const methodOverride = require('method-override')
const router = require('./routes')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const scheduleEvent = require('./public/javascript/scheduleEvent')
const schedule = require('node-schedule')

require('./models/mongoose')

if (process.env.NODE.ENV !== 'production') {
  require('dotenv').config()
}


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'paul',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})


//排定行程
let rule = new schedule.RecurrenceRule();
//每週1~5的12:10分執行
rule.dayOfWeek = [1, 2, 3, 4, 5];
rule.hour = 12
rule.minute = 10
rule.second = 00;
let job = schedule.scheduleJob(rule, scheduleEvent.checkSchedule, scheduleEvent.instrumentSchedule);

app.use(router)


app.listen(port, () => {
  console.log(`The server on localhost:${port} running.`)
})