require('dotenv').config()

const rpn = require('request-promise-native')

module.exports = () => {

    return new Promise ( function (resolve, reject) {

        rpn({ method: 'POST',
               uri: 'https://' + process.env.APP_WEB_URL + ':' + process.env.APP_WEB_PORT + '/api/authenticate'
             , data: {
                email    : process.env.APP_EMAIL
              , password : process.env.APP_MDP
            }
        })

        .then((body) => {

            console.log('api auth response: ', body)

            let headers = {
                'User-Agent'    : 'nodejs express bots/0.0.1'
              , 'Content-Type'  : 'application/json'
              , 'Authorization' : 'Bearer ' + body.token
            }

            let options = {
                  url: 'https://' +  process.env.APP_WEB_URL + ':' + process.env.APP_WEB_PORT + '/api/trashes'
                , method: 'POST'
                , headers: headers
                , body: {
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
              console.log('api post success', response)
              resolve(response)
            })

            .catch(err => {
              // Failed to post to API
              console.log('failed to post data to api', err)
              reject(err)
            })
        })

        .catch((err) => {
          // Auth failed
          console.log('Failed API auth', err)
          reject(err)
        })
    })
}
