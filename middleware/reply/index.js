const path        = require('path')
const telegramBot = require(path.join(__dirname,'./../bots/telegram.js'))
const savetodb    = require(path.join(__dirname,'./../db'))

module.exports = (req, res) => {

    try {

      let shareable_url = 'https://garbagepla.net/show/' + res.locals.result_id
      let message       = { text: 'Shareable url for the feature you just created: ' +  shareable_url }

      telegramBot.sendMessageTo(message, req.body.message.from.id)
      return res.sendStatus(200).end()

    } catch (err) {

      console.log('Error in reply.js:', err)
      let error = new Error('Something went wrong')
      return next(error)
    }
}
