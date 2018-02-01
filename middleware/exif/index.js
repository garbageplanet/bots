/*
 * Get image information middelware
 */

const getImageUrl = require('./imageurl.js')
const extractExif = require('./extract.js')

module.exports = {
  getImageUrl: getImageUrl,
  extractExif: extractExif
}
