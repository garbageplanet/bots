const express     = require('express')
const router      = express.Router()
const path        = require('path')
const getExif     = require(path.join(__dirname,'./../middleware/exif'))
const imgurUpload = require(path.join(__dirname,'./../middleware/imgur'))
const telegrambot = require(path.join(__dirname,'./../middleware/bots/telegram.js'))
// const twitterbot   = require(path.join(__dirname,'./../middleware/bots/twitter.js'))
// const messengerbot = require(path.join(__dirname,'./../middleware/bots/messenger.js'))
// const whatsappbot  = require(path.join(__dirname,'./../middleware/bots/whatsapp.js'))

// Receive data from each bot, upload to imgur, upload to dn and return shareable url
router.post('/telegram/*', getExif, imgurUpload, telegrambot)
// router.post('/twitter/*'  , imgstuff, twitterbot   )
// router.post('/messenger/*', imgstuff, messengerbot )
// router.post('/whatsapp/*' , imgstuff, whatsappbot  )

module.exports = router
