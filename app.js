                     require('dotenv').config()
const express      = require('express')
const path         = require('path')
const compression = require('compression')
const logger       = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser   = require('body-parser')
const csp          = require('helmet-csp')
const index        = require('./routes/index')
const app          = express()
const telegramBot  = require(path.join(__dirname,'./middleware/bots/telegram.js'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('trust proxy', '127.0.0.1')

app.use(compression())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(csp({
  directives: {
      defaultSrc: [  "'self'"
                   , 'https://api.telegram.org'
                  ]

    , connectSrc: [  "'self'"
                  , 'http://127.0.0.1:7000'
                  , 'https://' + process.env.APP_WEB_URL
                  , 'https://api.telegram.org'
                ]

    , scriptSrc: [  "'self'" ]

    , imgSrc: [  "'self'"
               , 'https://api.telegram.org'
            ]
  }
}))

app.use('/bots', index)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Forbidden')
  err.status = 403
  next(err)
})

// error handler
app.use(function(err, req, res, next) {

  if ( !err.status || err.status !==403 ) {

    telegramBot.sendMessageTo({text: err.message}, req.body.message.from.id)
    res.sendStatus(200).end()

  } else {

    res.sendStatus(err.status).end()
  }

})

console.log('Bots app started on port 7000')

module.exports = app
