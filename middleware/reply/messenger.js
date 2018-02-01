                     require('dotenv').config
const path         = require('path')
const messengerBot = require(path.join(__dirname,'./../bots/messenger.js'))

/*
 * Reply to messenger user if everything is ok
 */

//  function handleMessage(sender_psid, received_message) {
//
//    let response
//
//    // Checks if the message contains text
//    if ( received_message.text ) {
//      // Create the payload for a basic text message, which
//      // will be added to the body of our request to the Send API
//      response = {
//        "text": `Share this url with your friends!`
//      }
//
//    } else if ( received_message.attachments ) {
//      // Get the URL of the message attachment
//      let attachment_url = received_message.attachments[0].payload.url;
//
//    }
//
//    messengerBot.sendMessageTo(response, sender_psid)
// }
//
// function handlePostback(sender_psid, received_postback) {
//
//   let response;
//
//   // Get the payload for the postback
//   let payload = received_postback.payload;
//
//   // Set the response based on the postback payload
//   if ( payload === 'yes' ) {
//
//    response = { "text": "Yay!" }
//
//    //TODO send the share link
//
//   } else if ( payload === 'no' ) {
//
//     response = { "text": "Doh. Try sending it again." }
//   }
//   // Send the message to acknowledge the postback
//   messengerBot.sendMessageTo(response, sender_psid)
// }


module.exports = (req, res, next) => {

  let latlng   = res.locals.latlng.split(',')

  // URL format expected by the navigo-js routerin web app
  let share_url = 'https://garbagepla.net/#/s/garbage/' + res.locals.feature_id + '/' + latlng[0] + '/' + latlng[1]
  let message   = { text: `Thank you for your submission! You can now share this link ${share_url} with your friends!`}

  messengerBot.sendMessageTo(message, res.locals.sender)
  return res.sendStatus(200).end()

  // Check if the event is a message or postback and
  // pass the event to the appropriate handler function
  // if ( req.body.entry[0].messaging[0].message ) {
  //
  //   handleMessage(res.locals.sender, req.body.entry[0].messaging[0].message.text)
  //
  // } else if ( req.body.entry[0].messaging[0].postback ) {
  //
  //   handlePostback(res.locals.sender, req.body.entry[0].postback)
  //
  // } else {
  //
  //   let error = new Error('Something went wrong with me :(')
  //   next(error)
  //
  // }

}
