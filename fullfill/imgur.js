              require('dotenv').config()
const path  = require('path')
const imgur = require('imgur')

function postToImgur(params) {

  imgur.setClientId(process.env.IMGUR_CLIENT_ID)
  imgur.setAPIUrl(process.env.IMGUR_API_URL)
  imgur.setCredentials(process.env.IMGUR_EMAIL, process.env.IMGUR_PWD, process.env.IMGUR_CLIENT_ID)

  const requestOptions = {
    url: 'https://twcservice.mybluemix.net/api/weather/v1/geocode/' + lat + '/' + long + '/forecast/daily/3day.json?language=en-US&units=e',
    auth: {
      user: '[enter user-id here]',
      pass: '[enter password here]',
      sendImmediately: true
    },
    json: true
  };
  return request(requestOptions)
    .then((body) => body.data.link);
}
