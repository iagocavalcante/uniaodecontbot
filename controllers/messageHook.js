const request = require('request')

module.exports = (event, FACEBOOK_ACCESS_TOKEN, text) => {
    const senderId = event.sender.id
    const messageData = { "text": text }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: messageData,
        }
    });
};