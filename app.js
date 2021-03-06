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
const errors       = require(path.join(__dirname,'./middleware/errors'))

app.set('trust proxy', process.env.APP_LOCALHOST)

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
                  , 'https://ran.eu.everynet.io'
                  , 'https://ns.eu.everynet.io'
                  , process.env.AZURE_SRV_ADDRESS
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
app.use(errors)

console.log(`Bots app started on port ${process.env.APP_PORT}`)

module.exports = app
