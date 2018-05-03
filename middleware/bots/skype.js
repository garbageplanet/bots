                require('dotenv').config()
const builder = require('botbuilder')

const config = {
    appId: process.env.AZURE_BOT_APPID,
    appPassword: process.env.AZURE_BOT_APPPWD
}

const connector = new builder.ChatConnector(config)

var bot = new builder.UniversalBot(connector, function (session) {

  session.send("You said: %s", session.message.text)

});

module.exports = connector
