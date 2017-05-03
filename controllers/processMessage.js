const FACEBOOK_ACCESS_TOKEN = 'EAARnZCjoA6J4BAJu4dabKK2M2ZBh1YJGAMRkSCfd9JLDZBtKa5CbmDzdjmRACm4m71VqJAzmyIn8fJZA3LeGCfON3asigZCvBJqql8OtDy6e6rmqLgMe8ENEMGIXC0HAyjwbZBrx581Om5d3R7queNCSdQxYti5lWM5Epyz4AugQZDZD';


const request = require('request')
const messageHook = require('./messageHook')
const messageGeneric = require('./messageGeneric')


module.exports = (req, res) => {
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    text = event.message.text
                    if (text === 'oi') {
                        messageGeneric(sender)
                    } else if (text == 'contato') {
                        messageHook(sender, "Para marcar um jogo, mande um whatsapp para 981715232")
                    } else if (text == 'patrick') {
                        messageHook(sender, "Patrick é gayzao")
                    } else if (text == 'karla') {
                        messageHook(sender, "Karla é meu amor <3")
                    } else {
                        messageHook(sender, "Bot diz:" + text.substring(0, 200))
                    }
                }
                if (event.postback) {
                    text = JSON.stringify(event.postback)
                    messageHook(sender, "Postback received: " + text.substring(0, 200), token)
                    continue
                }
            })
        })

        res.status(200).end()
    }
}

// module.exports = (event) => {
//     messaging_events = request.body.entry[0].messaging
//     console.log(messaging_events)
//     for (i = 0; i < messaging_events.length; i++) {
//         event = request.body.entry[0].messaging[i]

//         if (event.message && event.message.text) {
//             text = event.message.text
//             if (text === 'oi') {
//                 messageGeneric(sender)
//                 continue
//             } else if (text == 'contato') {
//                 messageHook(sender, "Para marcar um jogo, mande um whatsapp para 981715232")
//             } else if (text == 'patrick') {
//                 messageHook(sender, "Patrick é gayzao")
//             } else if (text == 'karla') {
//                 messageHook(sender, "Karla é meu amor <3")
//             } else {
//                 messageHook(sender, "Bot diz:" + text.substring(0, 200))
//             }
//         }
//         if (event.postback) {
//             text = JSON.stringify(event.postback)
//             messageHook(sender, "Postback received: " + text.substring(0, 200), token)
//             continue
//         }
//     }
//     res.sendStatus(200)
// }
