// const botmaster  = require(path.join(__dirname,'./botmaster.js'))
// const TwitterBot = require('botmaster-twitter-dm')
//
// const twitterSettings = {
//   credentials: {
//     consumerKey: process.env.TWITTER,
//     consumerSecret: process.env.TWITTER,
//     accessToken: process.env.TWITTER,
//     accessTokenSecret: process.env.TWITTER,
//   }
// }
//
// const twitterBot = new TwitterBot(twitterSettings)
//
// botmaster.addBot(twitterBot)
//
// botmaster.use({
//   type: 'incoming',
//   name: 'my-middleware',
//   controller: (bot, update) => {
//     return bot.reply(update, 'Hello world!');
//   }
// })
//
// module.exports = twitterBot
