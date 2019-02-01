var request = require('request')

module.exports = {
  eventList (month, day) {
    let options = {
      url: 'http://history.muffinlabs.com/date/' + month + '/' + day,
      method: 'GET',
      headers: {}
    }
    return new Promise(function(resolve, reject) {
      request(options, function (err, res, body) {
        try {
          resolve(JSON.parse(body))
        }
        catch (ex) {
          reject(ex)
        }
      })
    })
  }
}