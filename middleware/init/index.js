/*
 * Initialize the conversation
 */

const telegram  = require('./telegram.js')
const messenger = require('./messenger.js')
//
// exports.telegram = telegram
// exports.messenger = messenger

module.exports = {
  messenger: messenger,
  telegram : telegram
}
