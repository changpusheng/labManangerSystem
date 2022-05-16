const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars').engine
const methodOverride = require('method-override')
const router = require('./routes')
const flash = require('connect-flash')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


app.use(express.static('public'))

app.use(router)
app.listen(port, () => {
  console.log(`The server on localhost:${port} running.`)
})