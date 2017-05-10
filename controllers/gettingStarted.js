'use strict'

const request = require('request')
const FACEBOOK_ACCESS_TOKEN = 'EAARnZCjoA6J4BAJu4dabKK2M2ZBh1YJGAMRkSCfd9JLDZBtKa5CbmDzdjmRACm4m71VqJAzmyIn8fJZA3LeGCfON3asigZCvBJqql8OtDy6e6rmqLgMe8ENEMGIXC0HAyjwbZBrx581Om5d3R7queNCSdQxYti5lWM5Epyz4AugQZDZD';

function register(res) {
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

function setupGreetingText(res) {
    let messageData = {
        "greeting": [{
            "locale": "default",
            "text": "Greeting text for default local !"
        }, {
            "locale": "en_US",
            "text": "Greeting text for en_US local !"
        }]
    };
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
        });

}

function setupPersistentMenu(res) {
    let messageData = {
        "persistent_menu": [{
                "locale": "default",
                "composer_input_disabled": true,
                "call_to_actions": [{
                        "title": "Info",
                        "type": "nested",
                        "call_to_actions": [{
                                "title": "Help",
                                "type": "postback",
                                "payload": "HELP_PAYLOAD"
                            },
                            {
                                "title": "Contact Me",
                                "type": "postback",
                                "payload": "CONTACT_INFO_PAYLOAD"
                            }
                        ]
                    },
                    {
                        "type": "web_url",
                        "title": "Visit website ",
                        "url": "http://www.techiediaries.com",
                        "webview_height_ratio": "full"
                    }
                ]
            },
            {
                "locale": "zh_CN",
                "composer_input_disabled": false
            }
        ]
    };
    // Start the request
    request({
            url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
            qs: { access_token: FACEBOOK_ACCESS_TOKEN },
            method: 'POST',
            json: {
                message: messageData
            }
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                res.send(body);

            } else {
                // TODO: Handle errors
                res.send(body);
            }
        });

}


function setupGetStartedButton(res) {
    let messageData = {
        "get_started": {
            "payload": "getstarted"
        }
    };
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
        });
}

module.exports = {
    setupGetStartedButton,
    register,
    setupGreetingText,
    setupPersistentMenu
}