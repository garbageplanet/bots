// Init the conversation with messenger user, check that it's a message from a Facebook Page with proper attachments
// const path   = require('path')
// const errors = require(path.join(__dirname,'./errors.js'))

module.exports = (req, res, next) => {

  console.log('Messenger entry: ', req.body.entry[0])
  console.log('Messenger messaging: ', req.body.entry[0].messaging[0])

  if ( req.body.object !== 'page' ) {

    console.log('No bot type or not sent through the facebook Page.', req.body)

    let error = new Error('You are not human, are you?')
    return next(error)
  }

  if ( req.body.entry[0].messaging[0].message.attachments[0].type === 'image' && req.body.entry[0].messaging[0].message.attachments[0].type !== 'file') {

    console.log('Image not sent as file.', req.body)

    let error = new Error('Make sure to attach the image you are sending as a file and not as a photo.')
    return next(error)
  }

  // TODO https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions
  // TODO https://developers.facebook.com/docs/messenger-platform/send-messages/#messaging_types

  return next()

}

// req.body.object === 'page'
// req.body.entry[0].messaging[0].sender.id
// req.body.entry[0].messaging[0].message.attachments[0].payload.url
// req.body.entry[0].messaging[0].message.attachments[0].type === 'file'

/*{
  "sender":{
    "id":"<PSID>"
  },
  "recipient":{
    "id":"<PAGE_ID>"
  },
  "timestamp":1458692752478,
  "message":{
    "mid":"mid.1458696618141:b4ef9d19ec21086067",
    "attachments":[
      {
        "type":"file",
        "payload":{
          "url":"<IMAGE_URL>"
        }
      },
      {
        "type":"location",
        "payload":{
          "coordinates":{
            "lat": 0.0000,
            "long": 0.0000
          }
        }
      }
    ]
  }
}*/

/*
{
  "object":"page",
  "entry":[
    {
      "id":"<PAGE_ID>",
      "time":1458692752478,
      "messaging":[
        {
          "sender":{
            "id":"<PSID>"
          },
          "recipient":{
            "id":"<PAGE_ID>"
          },

          ...
        }
      ]
    }
  ]
}
*/
