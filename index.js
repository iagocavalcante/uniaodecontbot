const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const verification = require('./controllers/verification')
const processMessage = require('./controllers/processMessage')

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function(req, res) {
    res.send("Hey Boy, how are you")
})

// for Facebook verification
app.get('/webhook/', verification)

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


// API End Point - added by Stefan

app.post('/webhook/', processMessage)




