
require('dotenv').config()

const path        = require('path')
const TelegramBot = require('botmaster-telegram')
const botmaster   = require(path.join(__dirname,'./botmaster.js'))
const savetodb    = require(path.join(__dirname,'./../db'))

const telegramSettings = {
    credentials     : { authToken: process.env.TELEGRAM_API_TOKEN }
  , webhookEndpoint : '/webhook' + process.env.BOTS_WEBHOOK_ENDPOINT_HASH
}

const telegramBot = new TelegramBot(telegramSettings)

botmaster.addBot(telegramBot)

module.exports = (req, res, next) => {

  let chatid    = req.body.message.chat.id

  let saved = async () => {
    return await savetodb()
  }

  console.log('saved db data:', saved)
  // build share url here

  const shareable_url = 'https://garbagepla.net/show/' + saved.id

  const message = {
    text: 'Shareable url for the feature you just created: ' +  shareable_url
  }

  telegramBot.sendMessageTo(message, req.body.message.from.id);

}
