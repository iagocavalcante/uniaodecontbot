const request = require('request');

module.exports = (event, FACEBOOK_ACCESS_TOKEN) => {
    const senderId = event.sender.id

    const messageData = {

        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "O que você quer fazer agora ?",
                "buttons": [{
                        "type": "postback",
                        "title": "Contato",
                        "payload": "evento_contato"
                    },
                    {
                        "type": "postback",
                        "title": "Ver produtos",
                        "payload": "evento_produtos"
                    }
                ]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: FACEBOOK_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: messageData,
        }
    })
}