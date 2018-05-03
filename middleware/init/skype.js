// Init the conversation with skype or cortana users
const path      = require('path')
const connector = require(path.join(__dirname,'./../bots/skype'))

module.exports = (req, res, next) => {

  var bot = new builder.UniversalBot(connector, function (session) {

    session.send("You said: %s", session.message.text)
    
  });

  console.log('Skype messaging conversation init: ', req.body)

  return next()

}
