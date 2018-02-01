module.exports = (req, res, next) => {

  // Get the two first characters in the url so we know which bot is called
  // note that we could use botmaster to do this but since we mount our own express app
  // we can only use the botmaster for the reply
//   let type = req.url.substr(1, 2)

  let type = req.url.split('/').shift()
  console.log(req.url.split('/'))
  console.log(type)
  res.locals.bot_type = type

  // switch (type) {
  //
  //   case 'me' : res.locals.bot_type = 'messenger'
  //
  //               res.locals.sender = req.body.entry[0].messaging[0].sender.id
  //   break
  //   case 'te' : res.locals.bot_type = 'telegram'
  //               res.locals.sender = req.body.message.from.id
  //   break
  //   case 'tw' : res.locals.bot_type = 'twitter'
  //   break
  //   case 'wh' : res.locals.bot_type = 'whatsapp'
  //   break
  //   case 'vi' : res.locals.bot_type = 'viber'
  //   break
  //   case 'we' : res.locals.bot_type = 'wechat'
  //   break
  //   case 'bb' : res.locals.bot_type = 'bbm'
  //   break
  //   default   : res.locals.bot_type = null
  //
  // }

  //console.log(`Sender id is ${res.locals.sender}`)
  console.log(`Sender is on ${res.locals.bot_type}`)

  return next()

}
