            require('dotenv').config()
const rpn = require('request-promise-native')

module.exports = (req, res, next) => {

    rpn({  method: 'POST',
           url: 'https://' + process.env.APP_WEB_URL + ':' + process.env.APP_WEB_PORT + '/api/authenticate'
         , formData: {
            email    : process.env.APP_EMAIL
          , password : process.env.APP_MDP
        }
    })

    .then((body) => {

        console.log('Api auth response: ', body)

        let parsedbody = JSON.parse(body)

        let headers = {
            'User-Agent'    : 'nodejs express bots/0.0.1'
          , 'Content-Type'  : 'application/json'
          , 'Authorization' : 'Bearer ' + parsedbody.token
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
          console.log('Api post success', response)
          // Pass the saved feature id to the locals
          res.locals.feature_id = response.id
          return next()
        })

        .catch(err => {
          // Failed to post to API
          console.log('Failed to submit data to api', err)
          let error = new Error('Something went wrong. My bad')
          return next(error)
        })
    })

    .catch((err) => {
      // Auth failed
      console.log('Failed api auth', err)
      let error = new Error('Something went wrong. My bad')
      next(error)
    })
}
