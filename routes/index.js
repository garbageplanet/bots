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

router.post('/:platform/*', (req, res, next) => {
    console.log(`POST to bots/${params.platform}`)

    res.locals.bot_type = params.platform

    return next()
})

router.post('/telegram' + webhook_endpoint, initConvo, getExif, uploadToImgur, /*setOptions,*/ saveToDb, replyToMessage)

router.post('/messenger' + webhook_endpoint, replyToMessage)

// Authorization mechanism for Facebook Messenger API
router.get('/messenger' + webhook_endpoint, verifyApp)

module.exports = router
