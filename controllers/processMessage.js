const FACEBOOK_ACCESS_TOKEN = 'EAARnZCjoA6J4BAJu4dabKK2M2ZBh1YJGAMRkSCfd9JLDZBtKa5CbmDzdjmRACm4m71VqJAzmyIn8fJZA3LeGCfON3asigZCvBJqql8OtDy6e6rmqLgMe8ENEMGIXC0HAyjwbZBrx581Om5d3R7queNCSdQxYti5lWM5Epyz4AugQZDZD';


const request = require('request')
const messageHook = require('./messageHook')
const messageGeneric = require('./messageGeneric')
const ini = requite('./inicializador')

ini = new Inicializador()

module.exports = (req, res) => {
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    text = event.message.text
                    ini.comands(text, events)
                }
                if (event.postback) {
                    text = JSON.stringify(event.postback)
                    messageHook(event, FACEBOOK_ACCESS_TOKEN, "Postback received: " + text.substring(0, 200))
                }
            })
        })

        res.status(200).end()
    }
}