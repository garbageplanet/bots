               require('dotenv').config()
const colors = require('colors')
const rpn    = require('request-promise-native')

module.exports = () => {

    // TODO http auth on application
    // see https://laravel.com/docs/5.5/authentication#http-basic-authentication

    return new Promise ( function (resolve, reject) {

        rpn({  method: 'POST',
               url: 'https://' + process.env.APP_WEB_URL + ':' + process.env.APP_WEB_PORT + '/api/authenticate'
             , formData: {
                email    : process.env.APP_EMAIL
              , password : process.env.APP_MDP
            }
        })

        .then((body) => {

            console.log('Api auth response: ', body)

            let headers = {
                'User-Agent'    : 'nodejs express bots/0.0.1'
              , 'Content-Type'  : 'application/json'
              , 'Authorization' : 'Bearer ' + body.token
            }

            let options = {
                  url: 'https://' +  process.env.APP_WEB_URL + ':' + process.env.APP_WEB_PORT + '/api/trashes'
                , method: 'POST'
                , headers: headers
                , formData: {
                    'image_url' : res.locals.imgur_url
                  , 'latlng'    : res.locals.latlng
                  , 'todo'      : 1
                  , 'amount'    : 3
                  , 'type'      : 'robot'
                 }
            }

            rpn(options)

            .then((response) => {
              // Success we can return the api response
              console.log('Api post success', response)
              resolve(response)
            })

            .catch(err => {
              // Failed to post to API
              console.log('Failed to post data to api'.inverse, err)
              reject(err)
            })
        })

        .catch((err) => {
          // Auth failed
          console.log('Failed api auth'.inverse, err)
          reject(err)
        })
    })
}
