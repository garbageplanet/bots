const express          = require('express')
const router           = express.Router()
const path             = require('path')
const getExif          = require(path.join(__dirname,'./../middleware/exif'))
const uploadToImgur    = require(path.join(__dirname,'./../middleware/imgur'))
// const setOptions       = require(path.join(__dirname,'./../middleware/options'))
const saveToDb         = require(path.join(__dirname,'./../middleware/db'))
const replyToMessage   = require(path.join(__dirname,'./../middleware/reply'))
const initConvo        = require(path.join(__dirname,'./../middleware/init'))
const verifyApp        = require(path.join(__dirname,'./../middleware/verify'))
const webhook_endpoint = '/webhook' + process.env.BOTS_WEBHOOK_ENDPOINT_HASH

// Receive data request, exract exif, upload to imgur, upload to dn and return shareable url

router.use((req, res, next) => {

  // Get the two first characters after the /bots/ in url so we know which bot is called
  // note that we could use botmaster to do this but since we mount our own express app, the bot is only used to reply
  let type = req.url.substr(1, 2)

//   console.log('Request', req)

  console.log('type:', type)

  switch (type) {

    case 'me' : res.locals.bot_type = 'messenger'
    break
    case 'te' : res.locals.bot_type = 'telegram'
    break
    case 'tw' : res.locals.bot_type = 'twitter'
    break
    case 'wh' : res.locals.bot_type = 'whatsapp'
    break
    case 'vi' : res.locals.bot_type = 'viber'
    break
    case 'we' : res.locals.bot_type = 'wechat'
    break
    case 'bb' : res.locals.bot_type = 'bbm'
    break
    default : res.locals.bot_type = null

  }

  next()

})

router.post('/telegram' + webhook_endpoint, initConvo, getExif, uploadToImgur, /*setOptions,*/ saveToDb, replyToMessage)

router.post('/messenger' + webhook_endpoint, replyToMessage)

// Authorization mechanism for Facebook Messenger API
router.get('/messenger' + webhook_endpoint, verifyApp)

module.exports = router
