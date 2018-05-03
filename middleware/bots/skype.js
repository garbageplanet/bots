require('dotenv').config()

const path      = require('path')
const SkypeBot  = require('botmaster-telegram')
const botmaster = require(path.join(__dirname,'./botmaster.js'))

const skypeSettings = {
    credentials     : { authToken: process.env.AZURE_API_TOKEN }
  , webhookEndpoint : '/webhook' + process.env.BOTS_WEBHOOK_ENDPOINT_HASH
}

const skypeBot = new SkypeBot(skypeSettings)

botmaster.addBot(skypeBot)

module.exports = skypeBot
