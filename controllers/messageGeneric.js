// const FACEBOOK_ACCESS_TOKEN = 'EAARnZCjoA6J4BAJu4dabKK2M2ZBh1YJGAMRkSCfd9JLDZBtKa5CbmDzdjmRACm4m71VqJAzmyIn8fJZA3LeGCfON3asigZCvBJqql8OtDy6e6rmqLgMe8ENEMGIXC0HAyjwbZBrx581Om5d3R7queNCSdQxYti5lWM5Epyz4AugQZDZD';


const request = require('request');

module.exports = (event, FACEBOOK_ACCESS_TOKEN) => {
    const senderId = event.sender.id;
    // const messageData = event.message.text;
    
    // console.log(senderId)
    const messageData = {
        // "setting_type": "greeting",
        // "greeting": {
        //     "text": "Olá {{user_first_name}}, bem-vindo ao chat do União Decont."
        // }
        "text": "Olá, bem-vindo ao chat do União Decont."


        // "attachment": {
        //     "type": "template",
        //     "payload": {
        //         "template_type": "generic",
        //         "elements": [{
        //             "title": "Ai Chat Bot Communities",
        //             "subtitle": "Communities to Follow",
        //             "image_url": "http://1u88jj3r4db2x4txp44yqfj1.wpengine.netdna-cdn.com/...",
        //             "buttons": [{
        //                 "type": "web_url",
        //                 "url": "https://www.facebook.com/groups/aic...",
        //                 "title": "FB Chatbot Group"
        //             }, {
        //                 "type": "web_url",
        //                 "url": "https://www.reddit.com/r/Chat_Bots/",
        //                 "title": "Chatbots on Reddit"
        //             }, {
        //                 "type": "web_url",
        //                 "url": "https://twitter.com/aichatbots",
        //                 "title": "Chatbots on Twitter"
        //             }],
        //         }, {
        //             "title": "Chatbots FAQ",
        //             "subtitle": "Aking the Deep Questions",
        //             "image_url": "https://tctechcrunch2011.files.wordpress.com/...",
        //             "buttons": [{
        //                 "type": "postback",
        //                 "title": "What's the benefit?",
        //                 "payload": "Chatbots make content interactive instead of static",
        //             }, {
        //                 "type": "postback",
        //                 "title": "What can Chatbots do",
        //                 "payload": "One day Chatbots will control the Internet of Things! You will be able to control your homes temperature with a text",
        //             }, {
        //                 "type": "postback",
        //                 "title": "The Future",
        //                 "payload": "Chatbots are fun! One day your BFF might be a Chatbot",
        //             }],
        //         }, {
        //             "title": "Learning More",
        //             "subtitle": "Aking the Deep Questions",
        //             "image_url": "http://www.brandknewmag.com/wp-cont...",
        //             "buttons": [{
        //                 "type": "postback",
        //                 "title": "AIML",
        //                 "payload": "Checkout Artificial Intelligence Mark Up Language. Its easier than you think!",
        //             }, {
        //                 "type": "postback",
        //                 "title": "Machine Learning",
        //                 "payload": "Use python to teach your maching in 16D space in 15min",
        //             }, {
        //                 "type": "postback",
        //                 "title": "Communities",
        //                 "payload": "Online communities & Meetups are the best way to stay ahead of the curve!",
        //             }],
        //         }]
        //     }
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