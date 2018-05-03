// Init the conversation with skype or cortana users

module.exports = (req, res, next) => {

  console.log('Skype messaging conversation init: ', req.body)

  return next()

}
