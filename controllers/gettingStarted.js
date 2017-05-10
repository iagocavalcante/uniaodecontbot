const request = require('request')

module.exports = (res, FACEBOOK_ACCESS_TOKEN) => {
    let messageData = {
        "get_started": [{
            "payload": "USER_DEFINED_PAYLOAD"
        }]
    }

    // Start the request
    request({
            url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
            qs: { access_token: FACEBOOK_ACCESS_TOKEN },
            method: 'POST',
            json: {
                message: messageData
            }
        },
        (error, response, body) => {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                res.send(body);

            } else {
                // TODO: Handle errors
                res.send(body);
            }
        })
}