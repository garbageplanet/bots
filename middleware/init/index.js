/*
 * Initialize the conversation
 */

const telegram  = require('./telegram.js')
const messenger = require('./messenger.js')
//const skype = require('./skype.js')

module.exports = {
  messenger: messenger,
  //skype: skype,
  telegram : telegram
}
