const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const verification = require('./controllers/verification')
const processMessage = require('./controllers/processMessage')
const getStarted = require('./controllers/gettingStarted')
const mongoose = require('mongoose')

const MONGO_HOST = (process.env.MONGO_HOST || 'heroku_bt4c199d:a1s2d3f4A!@ds133388.mlab.com:33388');
app.set('mongo_url', (process.env.MONGODB_URL || 'mongodb://' + MONGO_HOST + '/heroku_bt4c199d'));
app.set('port', (process.env.PORT || 5000))

mongoose.connect(app.get('mongo_url'), (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("connected to " + app.get('mongo_url'));
})

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', (req, res) => {
    res.send("Hey Boy, how are you")
})

// for Facebook verification
app.get('/webhook/', verification)

// Spin up the server
app.listen(app.get('port'), () => {
    console.log('running on port', app.get('port'))
})

// API End Point - added by Stefan
app.get('/setup', (req, res) => {
    getStarted(res);
})

app.post('/webhook/', processMessage)