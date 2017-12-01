require('dotenv').config()

const path        = require('path')
const imgur       = require('imgur')
const telegramBot = require(path.join(__dirname,'./../bots/telegram.js'))

imgur.setClientId(process.env.IMGUR_CLIENT_ID)
imgur.setAPIUrl(process.env.IMGUR_API_URL)
imgur.setCredentials(process.env.IMGUR_EMAIL, process.env.IMGUR_PWD, process.env.IMGUR_CLIENT_ID)

// The fucking promised hell
module.exports = (req, res, next) => {

    console.log('hit imgur middleware: ', req.body)

    // Then we upload to imgur directly with the lin to telegram api file
    imgur.uploadUrl(res.locals.image_url)

    .then(response => {

        console.log('imgur upload api response', response)

        res.locals.imgur_url = response.data.link
        return next()

      })

    .catch(err => {
        console.error('Failed to upload to imgur', err.message)

        telegramBot.sendMessageTo('Sorry, failed to upload your image to storage', req.body.message.from.id)
        return res.sendStatus(200).end()
      })
}
