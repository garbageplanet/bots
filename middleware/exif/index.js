                    require('dotenv').config()
const path        = require('path')
const rpn         = require('request-promise-native')
const ExifImage   = require('exif').ExifImage
const telegramBot = require(path.join(__dirname,'./../bots/telegram.js'))
const dms2dec     = require('dms2dec')

// const ImageHeaders = require('image-headers')
// const fastExif = require('fast-exif')

// The fucking promised hell
module.exports = (req, res, next) => {

    console.log('hit image middleware: ', req.body)

    if ( !req.body.message.document ) {

      console.log('Image not sent as file.')
      let error = new Error('You must send me an image file . Make sur to attach it as a file and not as a photo.')
      return next(error)
    }

    // TODO check req.body.message.is_bot
    const file_id = 'https://api.telegram.org/bot' + process.env.TELEGRAM_API_TOKEN + '/getFile?file_id=' + req.body.message.document.file_id

    console.log('file_id url for telegram getFile', file_id)

    rpn({ method: 'POST', uri: file_id })

    .then((body) => {

        console.log('telegram file api response: ', body)

        let parsedbody = JSON.parse(body)
        const image_url = 'https://api.telegram.org/file/bot' + process.env.TELEGRAM_API_TOKEN + '/' + parsedbody.result.file_path

        res.locals.image_url = image_url

        console.log('full image url', image_url)

        // We need to get the actual image to look at exif gps data
        // TODO try out 'image-headers' or 'fast-exifä so we don't need to get the whole image

        let image_file = rpn(image_url, {encoding: null})

        .then((body) => {

            console.log('Fetched image file')

            new ExifImage({ image : body }, (error, exifdata) => {

                if ( error ) {

                  console.log('Error getting exif data'.inverse, error.message)
                  let error = new Error('I could not parse the exif data, did you send a jpeg?')
                  return next(error)

                } else {
                  // Add the exif data to the res
                  try {
                      // gps:
                      // { ...,
                      //   GPSLatitudeRef: 'N',
                      //   GPSLatitude: [ 60, 9, 11.802 ],
                      //   GPSLongitudeRef: 'E',
                      //   GPSLongitude: [ 24, 55, 33.4304 ],
                      //   ...
                      // }

                      if ( !exifdata.gps ) {
                        let error = new Error('Enable geolocation in your device so I can read the geographical coordinates from your photos.')
                        return next(error)
                      }

                      console.log('Extracted image gps metadata: ', exifdata.gps)

                      // Convert GPS data from exif into decimal coordinates
                      let dc = dms2dec( exifdata.gps.GPSLatitude, exifdata.gps.GPSLatitudeRef, exifdata.gps.GPSLongitude, exifdata.gps.GPSLongitudeRef)

                      // let latlng = []
                      //     latlng.push(dc[0])
                      //     latlng.push(dc[1])
                      //
                      // console.log('latlngs: ', JSON.stringify(latlng))

                      // res.locals.latlng = latlng

                      res.locals.latlng = dc[0] + ',' + dc[1]

                      return next()

                  } catch (err) {

                      console.log('No exif data', err)
                      let error = new Error('Your exif data is empty.')
                      return next(error)
                  }
                }
            })
        })

        .catch(err =>{

          console.log('Failed to retrieve image from Telegram API', err)
          let error = new Error('There was a problem retrieving your image.')
          return next(error)
        })
    })

    .catch((err) => {

      console.log('Failed telegram file api', err)
      let error = new Error('There was a problem retrieving your image.')
      return next(error)
    })
}
