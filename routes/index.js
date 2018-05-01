const express          = require('express')
const router           = express.Router()
const path             = require('path')
const verifyApp        = require(path.join(__dirname,'./../middleware/verify'))
const checkType        = require(path.join(__dirname,'./../middleware/type'))
const initConvo        = require(path.join(__dirname,'./../middleware/init'))
const uploadToImgur    = require(path.join(__dirname,'./../middleware/imgur'))
const saveToDb         = require(path.join(__dirname,'./../middleware/db'))
const replyToMessage   = require(path.join(__dirname,'./../middleware/reply'))

const { getImageUrl, extractExif } = require(path.join(__dirname,'./../middleware/exif'))
const webhook_endpoint = '/webhook' + process.env.BOTS_WEBHOOK_ENDPOINT_HASH

// Receive data request, exract exif, upload to imgur, upload to dn and return shareable url
router.post(`/telegram${webhook_endpoint}`, checkType, initConvo.telegram, getImageUrl, extractExif, uploadToImgur, saveToDb, replyToMessage.telegram)
router.post(`/messenger${webhook_endpoint}`, checkType, initConvo.messenger, getImageUrl, extractExif, uploadToImgur, saveToDb, replyToMessage.messenger)
router.post(`/skype${webhook_endpoint}`, checkType, initConvo.skype, getImageUrl, extractExif, uploadToImgur, saveToDb, replyToMessage.messenger)

// Authorization mechanism for Facebook Messenger API, this needs to be continuously testable
router.get(`/messenger${webhook_endpoint}`, verifyApp)

module.exports = router
