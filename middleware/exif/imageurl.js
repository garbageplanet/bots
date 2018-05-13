            require('dotenv').config()
const rpn = require('request-promise-native')

module.exports = (req, res, next) => {

  if ( res.locals.bot_type === 'messenger' ) {

    try {
      // The imag url is direclty accessible in messenger
      res.locals.image_url = req.body.entry[0].messaging[0].message.attachments[0].payload.url

      return next()

    } catch (err) {

      let error = new Error(err.message)
      return next(error)
    }
  }

  if ( res.locals.bot_type === 'telegram' ) {

    // Make sure the file size is not bigger than 12 mega bytes
    if ( parseInt(req.body.message.document.file_size, 10) > 12000000 ) {

      let error = new Error('Your image is too large. Maximum size allowed is 12MB.')
      return next(error)
    }

    // With telegram we need to query the API to get the actual file url
    let file_id = `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/getFile?file_id=${req.body.message.document.file_id}`

    rpn({ method: 'POST', uri: file_id }).then((body) => {

        let parsed = JSON.parse(body)

        res.locals.image_url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_API_TOKEN}/${parsed.result.file_path}`

        return next()

    }).catch(err => {
      let error = new Error (`Error getting telegram image url: ${err.message}`)
      return next(error)
    })
  }
}
