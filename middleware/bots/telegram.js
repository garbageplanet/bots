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

module.exports = telegramBot
