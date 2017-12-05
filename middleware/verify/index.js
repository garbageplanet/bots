require('dotenv').config

// Adapted from https://github.com/fbsamples/messenger-platform-samples/blob/tutorial-starters/quick-start/app.js
// License at https://github.com/fbsamples/messenger-platform-samples/blob/master/LICENSE

module.exports = (req, res, next) => {

  let mode      = req.query['hub.mode']
  let token     = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']

  if (mode && token) {

    if (mode === 'subscribe' && token === process.env.FB_MESSENGER_VERIFY_TOKEN) {

      console.log('Messenger webhook verified')
      return res.status(200).send(challenge)

    } else {

      return res.sendStatus(403).end()
    }
  }
}
