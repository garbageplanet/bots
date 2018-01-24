/*
 * Initialize the conversation
 */

 module.exports = (req, res, next) => {

   if ( req.body.message.from.is_bot === true ) {

     console.log('Message is from bot.', req.body)

     let error = new Error('We don\'t serve your kind here.')
     return next(error)
   }

   if ( !req.body.message.document ) {

     console.log('Image not sent as file.', req.body)

     let error = new Error('I only work with images. You must send me an image. Make sure to attach it as a file and not as a photo.')
     return next(error)
   }

   res.locals.bot_type = 'telegram'

   return next()

 }
