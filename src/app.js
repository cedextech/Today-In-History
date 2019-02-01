'use strict'
let date = require('date-and-time')
var request = require('request')

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework')
const { Alexa } = require('jovo-platform-alexa')
const { GoogleAssistant } = require('jovo-platform-googleassistant')
const { JovoDebugger } = require('jovo-plugin-debugger')
const { FileDb } = require('jovo-db-filedb')

const app = new App()

app.use(
  new Alexa(),
  new GoogleAssistant(),
  new JovoDebugger(),
  new FileDb()
)

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

const handlers = {
  LAUNCH () {
    var response = 'Hello there! Are you ready to hear some facts that happened on this same date in history?'
    var rePrompt = 'Are you ready to hear some facts that happened on this same date in history?'
    this.ask(response, rePrompt)
  },

  async TellEvent () {
    var dateObj = this.$request.getTimestamp().split('T')
    let now = new Date(dateObj[0])
    var month = date.format(now, 'M')
    var day = date.format(now, 'D')

    var list = await listEvents(month, day)
    var eventList = list.data.Events
    
    var randomEvent = eventList.sort(function () { return 0.5 - Math.random() })
    var eventYear = randomEvent[0].year
    var eventText = randomEvent[0].text

    var eventResponse = 'On this same day in year ' + eventYear + ', ' + eventText + '. '
    var reprompt = 'Do you want to hear another event?'
    this.ask(eventResponse + reprompt, reprompt)
  },

  StopIntent () {
    this.tell('Ok, see you later.')
  }
}

app.setHandler(handlers)
module.exports.app = app

function listEvents (month, day) {
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