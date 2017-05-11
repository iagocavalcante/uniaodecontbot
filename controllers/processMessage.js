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
                        messageGeneric(event, FACEBOOK_ACCESS_TOKEN)
                    } else if (text === 'contato') {
                        messageHook(event, FACEBOOK_ACCESS_TOKEN, "Para marcar um jogo, mande um whatsapp para 981715232")
                    } else if (text === 'patrick') {
                        messageHook(event, FACEBOOK_ACCESS_TOKEN, "Patrick é gayzao")
                    } else if (text === 'karla') {
                        messageHook(event, FACEBOOK_ACCESS_TOKEN, "Karla é meu amor <3")
                    } else if (text === 'gustavo') {
                        messageHook(event, FACEBOOK_ACCESS_TOKEN, "Melhor goleiro de belém!")
                    } else if (text === 'bulão') {
                        messageHook(event, FACEBOOK_ACCESS_TOKEN, "Craque, joga 10!")
                    } else if (text === 'Ronnes') {
                        messageHook(event, FACEBOOK_ACCESS_TOKEN, "Entre na página https://www.facebook.com/reativafisioterapiaespecializada/")
                    } else if (text === 'Hermmann' || text === 'hermmann') {
                        messageHook(event, FACEBOOK_ACCESS_TOKEN, "Meu bb lindo")
                    } else if (text === 'remo' || text === 'Remo') {
                        messageHook(event, FACEBOOK_ACCESS_TOKEN, "Remo é minha vida, o remo é minha história!")
                    } else {
                        messageHook(event, FACEBOOK_ACCESS_TOKEN, "Bot diz:" + text.substring(0, 200))
                    }
                }
                console.log('LOG DO POSTBACK => ', event.postback)
                if (event.postback && event.postback.payload === 'evento_comecar') {
                    text = JSON.stringify(event.postback);

                    if (text === 'Get Started')
                    //sendMessage(event.sender.id,msg);
                        messageHook(event, FACEBOOK_ACCESS_TOKEN, "Postback received: " + text.substring(0, 200))
                }
            })
        })

        res.status(200).end()
    }
}