                     require('dotenv').config
const path         = require('path')
const telegramBot  = require(path.join(__dirname,'./../bots/telegram.js'))

/*
 * Reply to telegram user if everything is ok
 */

module.exports = (req, res, next) => {

  // TODO check if menu_callback

  try {

    let latlng   = res.locals.latlng.split(',')

    // URL format expected by the navigo-js routerin web app
    let share_url = 'https://garbagepla.net/#/s/garbage/' + res.locals.feature_id + '/' + latlng[0] + '/' + latlng[1]
    let message   = { text: 'Shareable url for the feature you just created: ' +  share_url }

    telegramBot.sendMessageTo(message, res.locals.sender)
    return res.sendStatus(200).end()

  } catch (err) {

    console.log('Error in reply.js:', err)
    let error = new Error('Something went wrong. My bad.')
    return next(error)
  }
}
