// Init the conversation with messenger user, check that it's a message from a Facebook Page with proper attachments
// const path   = require('path')
// const errors = require(path.join(__dirname,'./errors.js'))

module.exports = (req, res, next) => {

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
