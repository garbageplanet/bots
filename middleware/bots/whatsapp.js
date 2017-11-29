// const botmaster  = require(path.join(__dirname,'./botmaster.js'))
// const TwitterBot = require('botmaster-whatsapp')
//
// const whatsappSettings = {
//   credentials: {
//     consumerKey: process.env.TWITTER,
//     consumerSecret: process.env.TWITTER,
//     accessToken: process.env.TWITTER,
//     accessTokenSecret: process.env.TWITTER,
//   }
// }
// 
// const whatsappBot = new TwitterBot(whatsappSettings)
//
// botmaster.addBot(whatsappBot)
//
// botmaster.use({
//   type: 'incoming',
//   name: 'my-middleware',
//   controller: (bot, update) => {
//     return bot.reply(update, 'Hello world!');
//   }
// })
//
// module.exports = whatsappbot
