require('dotenv').config()

function postToBackend(params) {

  const requestOptions = {
    url: 'https://' + process.env.APP_WEB_URL + ':' + process.env.APP_WEB_PORT + '/api/authenticate',
    formData: {
       email    : process.env.APP_EMAIL,
       password : process.env.APP_MDP
    },
    json: true
  }

  request(requestOptions)

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
              'image_url' : params.imgur_url
            , 'latlng'    : params.latlng
            , 'todo'      : params.todo   || 1
            , 'amount'    : params.amount || 1
            , 'type'      : params.types  || 1
           }
      }
      // Pass the id of the newly created feature to the next middleware
      return request(options)
          .then((body) => body.id)
    })
}
