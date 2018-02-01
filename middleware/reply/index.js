/*
 * Reply middleware (request cycle ends here)
 */

const telegram  = require('./telegram')
const messenger = require('./messenger')

module.exports = {
  messenger: messenger,
  telegram : telegram
}
