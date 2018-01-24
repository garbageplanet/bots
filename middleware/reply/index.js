const path         = require('path')
const telegramBot  = require(path.join(__dirname,'./../bots/telegram.js'))
const messengerBot = require(path.join(__dirname,'./../bots/messenger.js'))
const savetodb     = require(path.join(__dirname,'./../db'))

/*
 * Reply to user if everything is ok
 */

module.exports = (req, res) => {

  if ( res.locals.bot_type = 'messenger' ) {

      

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
