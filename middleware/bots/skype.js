                require('dotenv').config()
const builder = require('botbuilder')
const config = {
    appId: process.env.AZURE_BOT_APPID,
    appPassword: process.env.AZURE_BOT_APPPWD
}

const connector = new builder.ChatConnector(config)
const bot = new builder.UniversalBot(connector)

module.exports = {
  bot: bot,
  connector : connector
}
