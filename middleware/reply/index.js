
                     require('dotenv').config
const path         = require('path')
const telegramBot  = require(path.join(__dirname,'./../bots/telegram.js'))
const messengerBot = require(path.join(__dirname,'./../bots/messenger.js'))
const savetodb     = require(path.join(__dirname,'./../db'))
const request      = require('request')

/*
 * Reply to user if everything is ok
 */

 function callSendAPI(sender_psid, response) {
   // Construct the message body
   let request_body = {
     "recipient": {
       "id": sender_psid
     },
     "message": response
   }

   request({
     "uri": "https://graph.facebook.com/v2.6/me/messages" + process.env.FB_PAGEID,
     "qs": { "access_token": process.env.FB_MESSENGER_PAGE_ACCESS_TOKEN },
     "method": "POST",
     "json": request_body
   }, (err, res, body) => {
     if (!err) {
       console.log('message sent!')
     } else {
       console.error("Unable to send message:" + err)
     }
   })
 }

 function handleMessage(sender_psid, received_message) {

  let response;

  // Check if the message contains text
  if ( received_message.text ) {

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". You need to send me an image.`
    }
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
}

module.exports = (req, res) => {

  /* Test code for messenger bot */

  if ( req.url.indexOf('messenger') > -1) {

    console.log('its a messenge', req.body)

    let body = req.body

    // Check the webhook event is from a Page subscription
    if ( body.object === 'page' ) {

      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0]
        console.log(webhook_event)

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id
        console.log('Sender PSID: ' + sender_psid)

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if ( webhook_event.message ) {

          handleMessage(sender_psid, webhook_event.message)

        } else {

            return res.sendStatus(404).end()
        }

      })

      // messengerBot.sendMessageTo(message, sender_psid)

      return res.sendStatus(200).end()

    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404).end();
    }

  } else {

    try {

      let latlng   = res.locals.latlng.split(',')

      // URL format expected by the navigo-js routerin web app
      let share_url = 'https://garbagepla.net/#/shared/garbage/' + res.locals.feature_id + '/' + latlng[0] + '/' + latlng[1]
      let message   = { text: 'Shareable url for the feature you just created: ' +  share_url }

      telegramBot.sendMessageTo(message, req.body.message.from.id)
      return res.sendStatus(200).end()

    } catch (err) {

      console.log('Error in reply.js:', err)
      let error = new Error('Something went wrong. My bad.')
      return next(error)
    }
  }
}
