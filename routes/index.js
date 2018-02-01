const express          = require('express')
const router           = express.Router()
const path             = require('path')
const verifyApp        = require(path.join(__dirname,'./../middleware/verify'))
const initConvo        = require(path.join(__dirname,'./../middleware/init'))
const uploadToImgur    = require(path.join(__dirname,'./../middleware/imgur'))
const saveToDb         = require(path.join(__dirname,'./../middleware/db'))
const replyToMessage   = require(path.join(__dirname,'./../middleware/reply'))

const { getImageUrl, extractExif } = require(path.join(__dirname,'./../middleware/exif'))

const webhook_endpoint = '/webhook' + process.env.BOTS_WEBHOOK_ENDPOINT_HASH

// Receive data request, exract exif, upload to imgur, upload to dn and return shareable url

router.use((req, res, next) => {

  // Get the two first characters in the url so we know which bot is called
  // note that we could use botmaster to do this but since we mount our own express app
  // we can only use the botmaster for the reply
  let type = req.url.substr(1, 2)

  switch (type) {

    case 'me' : res.locals.bot_type = 'messenger'
                res.locals.sender = req.body.entry[0].sender.id
    break
    case 'te' : res.locals.bot_type = 'telegram'
                res.locals.sender = req.body.message.from.id
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

  return next()

})

router.post(`/telegram${webhook_endpoint}`, initConvo.telegram, getImageUrl, extractExif, uploadToImgur, saveToDb, replyToMessage.telegram)

router.post(`/messenger${webhook_endpoint}`,initConvo.messenger, getImageUrl, extractExif, uploadToImgur, saveToDb, replyToMessage.messenger)

// Authorization mechanism for Facebook Messenger API, this needs to be continuously testable
router.get(`/messenger${webhook_endpoint}`, verifyApp)

module.exports = router
