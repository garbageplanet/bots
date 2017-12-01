
const path        = require('path')
const telegramBot = require(path.join(__dirname,'./../bots/telegram.js'))
const savetodb    = require(path.join(__dirname,'./../db'))

module.exports = (req, res, next) => {

  // Save to app backend
  savetodb()

      .then(result => {

          console.log('Saved db data:', result)
          // TODO build share url here

          const shareable_url = 'https://garbagepla.net/show/' + result.id
          const message       = { text: 'Shareable url for the feature you just created: ' +  shareable_url }

          telegramBot.sendMessageTo(message, req.body.message.from.id)
          res.sendStatus(200).end()

      })

      .catch(err=>{

        console.log('Failed to save to db', err.message)

        telegramBot.sendMessageTo({text:'Something went wrong while saving your photo, my bad.'}, req.body.message.from.id)
        res.sendStatus(200).end()
      })
}
