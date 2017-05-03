const request = require('request');

module.exports = (event, FACEBOOK_ACCESS_TOKEN) => {
    const senderId = event.sender.id
    
    const messageData = {

        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Minhas Páginas",
                    "subtitle": "Dá um olho ai",
                    "image_url": "https://www.facebook.com/1017538364967740/photos/1023731624348414/",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://viladosilicio.com.br/",
                        "title": "Blog nosso"
                    }],
                }, {
                    "title": "Iago Cavalcante",
                    "subtitle": "Meu site pessoal",
                    "image_url": "https://scontent.fbel1-1.fna.fbcdn.net/v/t1.0-0/p206x206/15055622_1177560302324763_7031871446616115753_n.jpg?oh=858c69b7db1ac067cc167bc0aafe1460&oe=598F78DD",
                    "buttons": [{
                       "type": "web_url",
                        "url": "http://iagocavalcante.com.br/",
                        "title": "Meu site"
                    }],
                }]
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