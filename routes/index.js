const express        = require('express')
const router         = express.Router()
const path           = require('path')
const getExif        = require(path.join(__dirname,'./../middleware/exif'))
const uploadToImgur  = require(path.join(__dirname,'./../middleware/imgur'))
const saveToDb       = require(path.join(__dirname,'./../middleware/db'))
const replyToMessage = require(path.join(__dirname,'./../middleware/reply'))

// Receive data request, exract exif, upload to imgur, upload to dn and return shareable url
router.post('/telegram/*', getExif, uploadToImgur, saveToDb, replyToMessage)

module.exports = router
