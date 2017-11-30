require('dotenv').config()

const rpn       = require('request-promise-native')
const ExifImage = require('exif').ExifImage
// const ImageHeaders = require('image-headers')
// const fastExif = require('fast-exif')

// The fucking promised hell
module.exports = (req, res, next) => {

    console.log('hit image middleware: ', req.body)

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

        let image_file = rpn(image_url, {encoding: null}).then((body) => {

            console.log('Fetched image file')

            // fastExif.read(body)
            //     .then(info => {
            //         console.log('exif info', info)
            //     })
            //     .catch(err => {
            //         console.log(err)
            //     })

            try {

                new ExifImage({ image : body }, (error, exifdata) => {

                    if (error) {
                      console.log('Error getting exif data: ' + error.message)
                      return res.end()

                    } else {
                      // Add the exif data to the res
                      console.log('Extracted image metadata: ', exifdata)

                      try {
                        // Process GPS data and convert coordinates
                        // gps:
                        // { ...,
                        //   GPSLatitudeRef: 'N',
                        //   GPSLatitude: [ 60, 9, 11.802 ],
                        //   GPSLongitudeRef: 'E',
                        //   GPSLongitude: [ 24, 55, 33.4304 ],
                        //   ...
                        // }

                        // Hacky for testing, need to convert the degrees seconds to decimal degrees
                        //lat = exifdata.gps.GPSLatitude[0] + ( ( parseInt(exifdata.gps.GPSLatitude[1]) / 60 ) + ( parseFloat(exifdata.gps.GPSLatitude[2]) /3600) )
                        let lat = exifdata.gps.GPSLatitude[0] + ',' + exifdata.gps.GPSLatitude[1] + exifdata.gps.GPSLatitude[2]
                        let lng = exifdata.gps.GPSLongitude[0] + ',' + exifdata.gps.GPSLongitude[1] + exifdata.gps.GPSLongitude[2]

                        let latlng = []
                        latlng.push(lat)
                        latlng.push(lng)

                        console.log('latlngs', latlng)

                        res.locals.latlng = latlng

                        return next()

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
    })

    .catch((err) => {
      // Auth failed
      console.log('Failed telegram file api', err)
      res.end()
    })
}
