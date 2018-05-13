const ExifImage = require('exif').ExifImage
const dms2dec   = require('dms2dec')
const rpn       = require('request-promise-native')

// Exif gps format
// gps:
// { ...,
//   GPSLatitudeRef: 'N',
//   GPSLatitude: [ 60, 9, 11.802 ],
//   GPSLongitudeRef: 'E',
//   GPSLongitude: [ 24, 55, 33.4304 ],
//   ...
// }

module.exports = (req, res, next) => {

  // TODO use json: true

  // Fetch the actual image file from the url
  rpn(res.locals.image_url, {encoding: null})

  .then((data) => {

    new ExifImage({ image : data }, (err, exifdata) => {

        if ( err ) {

          let error = new Error(`Error reading exif data: ${err.message}`)
          return next(error)

        } else {

          if ( !exifdata.gps ) {

            let error = new Error('I could not find gps data in your image. Please try again.')
            return next(error)
          }

          console.log('Extracted image gps metadata: ', exifdata.gps)

          // Convert GPS data from exif into decimal coordinates
          let dc = dms2dec(exifdata.gps.GPSLatitude, exifdata.gps.GPSLatitudeRef, exifdata.gps.GPSLongitude, exifdata.gps.GPSLongitudeRef)

          // Latlng format expected by backend "lat, lng"
          res.locals.latlng  = dc[0] + ', ' + dc[1]

          return next()
        }
    })
  }).catch(err => {

    console.log(`Error fetching image data in extract.js: ${err}`)
    let error = new Error(`Error fetching image data: ${err}`)

    return next(error)
  })
}
