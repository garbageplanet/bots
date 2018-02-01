module.exports = (req, res, next) => {

  // Get the two first characters in the url so we know which bot is called
  // note that we could use botmaster to do this but since we mount our own express app
  // we can only use the botmaster for the reply
//   let type = req.url.substr(1, 2)

  let type = req.url.slice(1).split('/').shift()
  res.locals.bot_type = type

  switch (type) {

    case 'messenger' : res.locals.sender = req.body.entry[0].messaging[0].sender.id
    break
    case 'telegram' : res.locals.sender = req.body.message.from.id
    break
    default   : res.locals.sender = null
  }

  //console.log(`Sender id is ${res.locals.sender}`)
  console.log(`Sender is on ${res.locals.bot_type}`)

  if ( !type ) {
    return res.sendStatus(404).end()
  }

  return next()

}
