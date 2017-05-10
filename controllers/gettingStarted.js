const request = require('request')
const FACEBOOK_ACCESS_TOKEN = 'EAARnZCjoA6J4BAJu4dabKK2M2ZBh1YJGAMRkSCfd9JLDZBtKa5CbmDzdjmRACm4m71VqJAzmyIn8fJZA3LeGCfON3asigZCvBJqql8OtDy6e6rmqLgMe8ENEMGIXC0HAyjwbZBrx581Om5d3R7queNCSdQxYti5lWM5Epyz4AugQZDZD';

module.exports = (res) => {
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