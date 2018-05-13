const path         = require('path')
const telegramBot  = require(path.join(__dirname,'./../bots/telegram.js'))
const messengerBot = require(path.join(__dirname,'./../bots/messenger.js'))
const {bot}        = require(path.join(__dirname,'./../bots/skype.js'))

module.exports = (err, req, res, next) => {

  if ( !err.status || err.status !==403 ) {

    // Reply according to the bot type
    switch (res.locals.bot_type) {

        case 'telegram' :
            telegramBot.sendMessageTo({text: err.message}, res.locals.sender)
            res.sendStatus(200).end()
            break

        case 'messenger' :
            messengerBot.sendMessageTo({text: err.message}, res.locals.sender)
            res.sendStatus(200).end()
            break

        case 'twitter' :
            res.sendStatus(200).end()
            break

        case 'skype' :
            //bot.
            res.sendStatus(200).end()
            break

        default: res.sendStatus(200).end()
    }

  } else {

    res.sendStatus(err.status).end()
  }

}
