require('dotenv').config()

const rpn       = require('request-promise-native')
const imgur     = require('imgur')
const ExifImage = require('exif').ExifImage

imgur.setClientId(process.env.IMGUR_CLIENT_ID)
imgur.setAPIUrl(process.env.IMGUR_API_URL)
imgur.setCredentials(process.env.IMGUR_EMAIL, process.env.IMGUR_PWD, process.env.IMGUR_CLIENT_ID)

// The fucking promised hell
module.exports = (req, res, next) => {

    console.log('hit image middleware: ', req.body)

    // TODO check req.body.message.is_bot

    rpn({ method: 'POST',
        uri: 'https://api.telegram.org/bot' + process.env.TELEGRAM_API_TOKEN + '/getFile?file_id=' + req.body.message.document.file_id
    })

    .then((body) => {
      
        console.log('telegram file api response: ', body)

        const image_url = 'https://api.telegram.org/file/bot' + process.env.TELEGRAM_API_TOKEN + body.file_path

        // We need to get the actual image to look at exif gps data
        let image_file = rpn(image_url, {encoding: 'binary'}).then(body => {

            console.log('Fetched image file', body)

            try {

                new ExifImage({ image : body }, (error, exifdata) => {

                    if (error) {
                      console.log('Error getting exif data' + error.message)
                      return res.end()

                    } else {
                      // Add the exif data to the res
                      console.log('Extracted image metadata', exifdata)

                      try {
                        res.local.exif = exifdata.gps

                      } catch (err) {
                        console.log('No exif data', err)
                        res.end()
                      }
                    }
                })

            } catch (error) {
                console.log('Error: ' + error.message)
                return res.end()
            }

        }).catch(err =>{
          console.log('Failed to retrieve image from Telegram API', err)
          return res.end()
        })

        // Then we upload to imgur directly with the lin to telegram api file
        imgur.uploadUrl(image_url).then(response => {

            console.log('imgur upload api response', response)

            res.locals.imgur_url = response.data.link
            return next()

          })
          .catch(err => {
            console.error('Failed to upload to imgur', err.message)
            return res.end()
          })
    })

    .catch((err) => {
      // Auth failed
      console.log('Failed telegram file api', err)
      res.end()
}
})
