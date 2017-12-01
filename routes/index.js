const express        = require('express')
const router         = express.Router()
const path           = require('path')
const getExif        = require(path.join(__dirname,'./../middleware/exif'))
const imgurUpload    = require(path.join(__dirname,'./../middleware/imgur'))
const replyToMessage = require(path.join(__dirname,'./../middleware/reply'))

// Receive data from each bot, upload to imgur, upload to dn and return shareable url
router.post('/telegram/*', getExif, imgurUpload, replyToMessage)


module.exports = router
