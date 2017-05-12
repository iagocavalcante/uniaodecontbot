const request = require('request');

module.exports = (event, FACEBOOK_ACCESS_TOKEN) => {
    const senderId = event.sender.id

    const messageData = {

        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Welcome to Peter\'s Hats",
                    "image_url": "https://petersfancybrownhats.com/company_image.png",
                    "subtitle": "We\'ve got the right hat for everyone.",
                    "default_action": {
                        "type": "web_url",
                        "url": "https://peterssendreceiveapp.ngrok.io/view?item=103",
                        "messenger_extensions": true,
                        "webview_height_ratio": "tall",
                        "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                    },
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://petersfancybrownhats.com",
                        "title": "View Website"
                    }, {
                        "type": "postback",
                        "title": "Start Chatting",
                        "payload": "DEVELOPER_DEFINED_PAYLOAD"
                    }]
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