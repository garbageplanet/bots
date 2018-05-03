                     require('dotenv').config()
const express      = require('express')
const path         = require('path')
const compression  = require('compression')
const logger       = require('morgan')
const Limiter      = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const bodyParser   = require('body-parser')
const csp          = require('helmet-csp')
const index        = require('./routes/index')
const app          = express()
const telegramBot  = require(path.join(__dirname,'./middleware/bots/telegram.js'))
const messengerBot = require(path.join(__dirname,'./middleware/bots/messenger.js'))

app.set('trust proxy', process.env.APP_URL)

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
                  , `http://${process.env.APP_URL}:${process.env.PORT}`
                  , `https://${process.env.APP_WEB_URL}`
                  , 'https://api.telegram.org'
                  , 'https://www.facebook.com'
                  , 'https://www.facebook.com'
                ]

    , scriptSrc: [  "'self'" ]

    , imgSrc: [  "'self'"
               , 'https://api.telegram.org'
               , 'https://www.facebook.com'
            ]
  }
}))

const limiter = new Limiter({
    windowMs: process.env.APP_REQ_WINDOW
  , max: process.env.APP_REQ_LIMIT
  , delayMs: process.env.APP_REQ_DELAY
})

//  Apply rate limits to all requests
app.use(limiter);

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

    // Reply according to the bot type
    switch (res.locals.bot_type) {

        case 'telegram' :
            telegramBot.sendMessageTo({text: err.message}, res.locals.sender)
            res.sendStatus(200).end()
            break

        case 'messenger' :
            messengerBot.sendMessageTo({text: err.message}, res.locals.sender)
            res.sendStatus(200).end()
            break

        case 'twitter' :
            res.sendStatus(200).end()
            break

        case 'skype' :
            res.sendStatus(200).end()
            break

        default: res.sendStatus(200).end()
    }

  } else {

    res.sendStatus(err.status).end()
  }

})

console.log(`Bots app started on port ${process.env.PORT}`)

module.exports = app
