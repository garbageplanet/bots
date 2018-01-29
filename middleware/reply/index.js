const path         = require('path')
const telegramBot  = require(path.join(__dirname,'./../bots/telegram.js'))
const messengerBot = require(path.join(__dirname,'./../bots/messenger.js'))
const savetodb     = require(path.join(__dirname,'./../db'))

/*
 * Reply to user if everything is ok
 */

module.exports = (req, res) => {

  /* Test code for messenger bot */

  if ( req.url.indexOf('messenger') > -1) {

    console.log('its a messenge', req.body)

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

        // Get the webhook event. entry.messaging is an array, but
        // will only ever contain one event, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);

                // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);

      });


      let message   = { text: 'Well done, Potter.' }

      messengerBot.sendMessageTo(message, sender_psid)

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
