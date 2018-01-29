/*
 * Initialize the conversation
 */

 module.exports = (req, res, next) => {

   if ( !res.locals.bot_type ) {

     console.log('No bot type.', req.body)

     let error = new Error('Cant touch dis.')
     return next(error)
   }

   if ( res.locals.bot_type === 'telegram' && req.body.message.from.is_bot === true ) {

     console.log('Message is from bot.', req.body)

     let error = new Error('We don\'t serve your kind here.')
     return next(error)
   }

   if ( res.locals.bot_type === 'telegram' && !req.body.message.document ) {

     console.log('Image not sent as file.', req.body)

     let error = new Error('I only work with images. You must send me an image. Make sure to attach it as a file and not as a photo.')
     return next(error)
   }

   return next()

 }
