            require('dotenv').config()
const rpn = require('request-promise-native')

module.exports = (req, res, next) => {

    // TODO use json: true

    rpn({  method: 'POST',
           url: `https://${process.env.APP_WEB_URL}:${process.env.APP_WEB_PORT }/api/authenticate`
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
              url: `https://${process.env.APP_WEB_URL}:${process.env.APP_WEB_PORT }/api/trashes`
            , method: 'POST'
            , headers: headers
            , formData: {
                'image_url' : res.locals.imgur_url
              , 'latlng'    : res.locals.latlng
              , 'todo'      : res.locals.todo   || 1
              , 'amount'    : res.locals.amount || 1
              , 'type'      : res.locals.types  || 1
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
          let error = new Error(`Failed to save the image to the backend: ${err.message}`)
          return next(error)
        })
    })

    .catch((err) => {
      // Auth failed
      let error = new Error(`Failed to save the image to the backend: ${err.message}`)
      next(error)
    })
}
