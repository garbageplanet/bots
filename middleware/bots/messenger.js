                     require('dotenv').config
const path         = require('path')
const botmaster    = require(path.join(__dirname,'./botmaster.js'))
const MessengerBot = require('botmaster-messenger')

const messengerSettings = {
    credentials: {
        verifyToken      : process.env.FB_MESSENGER_VERIFY_TOKEN
      , pageToken        : process.env.FB_MESSENGER_PAGE_ACCESS_TOKEN
      , fbAppSecret      : process.env.FB_MESSENGER_APP_SECRET
    }
  , webhookEndpoint: '/webhook' + process.env.BOTS_WEBHOOK_ENDPOINT_HASH,
}

const messengerBot = new MessengerBot(messengerSettings)

botmaster.addBot(messengerBot)

module.exports = messengerBot
