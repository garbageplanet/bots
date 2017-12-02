require('dotenv').config()

const path        = require('path')
const rpn         = require('request-promise-native')
const ExifImage   = require('exif').ExifImage
const telegramBot = require(path.join(__dirname,'./../bots/telegram.js'))
const dms2dec     = require('dms2dec')
const colors      = require('colors')


// const ImageHeaders = require('image-headers')
// const fastExif = require('fast-exif')

// The fucking promised hell
module.exports = (req, res, next) => {

    console.log('hit image middleware: ', req.body)

    if ( !req.body.message.document ) {
      console.log('Error - no document in message'.inverse)

      telegramBot.sendMessageTo({text:'You must send me an image as a document so I can get the exif info.'}, req.body.message.from.id)
      return res.sendStatus(200).end()
    }

    // TODO check req.body.message.is_bot
    const file_id = 'https://api.telegram.org/bot' + process.env.TELEGRAM_API_TOKEN + '/getFile?file_id=' + req.body.message.document.file_id

    console.log('file_id url for telegram getFile', file_id)

    rpn({ method: 'POST',
        uri: file_id
    })

    .then((body) => {

        console.log('telegram file api response: ', body)

        parsedbody = JSON.parse(body)

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

                  telegramBot.sendMessageTo({text:'I could not parse the exif data, did you send a jpeg?'}, req.body.message.from.id)
                  return res.sendStatus(200).end()

                } else {
                  // Add the exif data to the res
                  console.log('Extracted image metadata: ', exifdata)

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
                      telegramBot.sendMessageTo({text:'You must enable geolocation in your device so I can read the geographical coordinates from your photos.'}, req.body.message.from.id)
                      return res.sendStatus(200).end()
                    }

                    // Convert GPS data from exif into decimal coordinates
                    let dc = dms2dec( exifdata.gps.GPSLatitude, exifdata.gps.GPSLatitudeRef, exifdata.gps.GPSLongitude, exifdata.gps.GPSLongitudeRef)

                    let latlng = []
                        latlng.push(dc[0])
                        latlng.push(dc[1])

                    console.log('latlngs: ', JSON.stringify(latlng))

                    res.locals.latlng = latlng

                    return next()

                  } catch (err) {
                    console.log('No exif data'.inverse, err)

                    telegramBot.sendMessageTo({text:'The exif data is empty'}, req.body.message.from.id)
                    return res.sendStatus(200).end()
                  }
                }
            })
        })

        .catch(err =>{
          console.log('Failed to retrieve image from Telegram API'.inverse, err)

          telegramBot.sendMessageTo({text:'There was a problem retrieving your image.'}, req.body.message.from.id)
          return res.sendStatus(200).end()
        })
    })

    .catch((err) => {
      console.log('Failed telegram file api'.inverse, err)

      telegramBot.sendMessageTo({text:'There was a problem retrieving your image.'}, req.body.message.from.id)
      return res.sendStatus(200).end()
    })
}
