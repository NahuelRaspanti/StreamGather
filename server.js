const express = require("express");
const grant = require("grant-express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require('mongoose');
const userModel = require('./models/user');
const MongoStore = require('connect-mongo')(session);
var MemoryStore = session.MemoryStore;
const sessionStore = new MemoryStore();

const axios = require("axios").default;
var Schema = mongoose.Schema;

require('dotenv').config();

var app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

//mongoose.connect('mongodb+srv://admin:jq9arryWKcbOyxdp@cluster0-nsozd.gcp.mongodb.net/test?retryWrites=true&w=majority');

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Client-ID'] = process.env.TWITCH_KEY;
axios.defaults.headers.post['Content-Type'] = 'application/vnd.twitchtv.v5+json'

app.use(session({secret: 'grant', resave: false, saveUninitialized: false, cookie: {maxAge: 1000*60*60*24*30*12 }, store: sessionStore}));

app.use(grant({
    "defaults": {
        "protocol": "http",
        "host": "localhost:5000",
        "transport": "session",
        "state": true
    },
    "twitch": {
        "key": process.env.TWITCH_KEY,
        "secret": process.env.TWITCH_SECRET,
        "scopes": ["user_read"],
        "callback": "http://localhost:3000/handle_twitch_callback"
    },
    "mixer": {
        "key": process.env.MIXER_KEY,
        "secret": process.env.MIXER_SECRET,
        "scopes": ["user-read"],
        "callback": "http://localhost:3000/handle_mixer_callback"
    }
}));

app.get('/get_mixer_streams', async function (req, res) {
    try {
        await axios.get('https://mixer.com/api/v1/users/124617714/follows',)
        .then(response => {
            res.send(response.data)
        })
        .catch(error => {
            res.send(error.response)
        })
    }
    catch (err){
        res.send(err);
    }
})

app.get('/get_twitch_streams', async function (req, res) {
    try{
        await axios.get('https://api.twitch.tv/kraken/streams/followed',
             {headers : {'Authorization': 'OAuth ' + req.session.grant.response.access_token, 'Accept': 'application/vnd.twitchtv.v5+json'}})
            .then(response => {
                res.send(response.data)
            })
            .catch(error => {
                res.send(error.response)
                console.log(MongoStore.getItem(req.sessionID))
            });
    }
    catch(err){
        console.error("pete", err);
        console.log(MongoStore.getItem(req.sessionID))
    }
});

app.get('/handle_twitch_callback', async function (req, res) {
    const { error, error_description, error_uri } = req.query
    if (error) {
        res.status(500).json({
            error,
            error_description,
            error_uri
        })
    } else {
        res.redirect("/");
    }
});

app.get('/handle_mixer_callback', async function (req, res) {
    const { error, error_description, error_uri } = req.query
    if (error) {
        res.status(500).json({
            error,
            error_description,
            error_uri
        })
    } else {
        await axios.get('https://mixer.com/api/v1/users/current', {
            headers: {
                'Authorization': 'Bearer ' + req.session.grant.response.access_token
            }
        })
        .then(resp => {
            res.redirect("/");
        })
        .catch(err => {
            res.end(err);
        })
    }
});

app.get('/', (req, res) => {
    res.status(200).send('La API funciona correctamente');
  });

const PORT = process.env.PORT || 5000

app.listen(PORT, function () {
    console.log('server running on port : 5000');
});
