                    require('dotenv').config()
const path        = require('path')
const imgur       = require('imgur')

imgur.setClientId(process.env.IMGUR_CLIENT_ID)
imgur.setAPIUrl(process.env.IMGUR_API_URL)
imgur.setCredentials(process.env.IMGUR_EMAIL, process.env.IMGUR_PWD, process.env.IMGUR_CLIENT_ID)

/*
 * Upload image to imgur and retrieve url
 */

// The fucking promised hell
module.exports = (req, res, next) => {

    console.log('hit imgur middleware: ', req.body)

    // Then we upload to imgur directly with the lin to telegram api file
    imgur.uploadUrl(res.locals.image_url)

    .then(response => {

        console.log('imgur upload api response', response)
        // ouch, the backend/fontend bugs with https
        let link = response.data.link
        let httplink = link.replace('https','http')
        res.locals.imgur_url = httplink
        return next()

      })

    .catch(err => {

        console.error('Failed to upload to imgur', err.message)
        let error = new Error('Failed to upload your image to storage. My bad.')
        return next(error)
      })
}
