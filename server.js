const express = require("express");
const grant = require("grant-express");
const cors = require("cors");
const session = require("express-session");

const axios = require("axios").default;

require('dotenv').config();

var app = express();


axios.defaults.withCredentials = true;
axios.defaults.headers.common['Client-ID'] = process.env.TWITCH_KEY;
axios.defaults.headers.post['Content-Type'] = 'application/vnd.twitchtv.v5+json'

app.use(session({secret: 'grant', resave: false, saveUninitialized: false}));

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
        "callback": "/handle_twitch_callback"
    }
}));



app.get('/get_twitch_streams', function (req, res) {
    try{
        axios.get('https://api.twitch.tv/kraken/streams/followed', {headers : {'Authorization': 'OAuth ' + req.session.grant.response.access_token, 'accept': 'application/vnd.twitchtv.v5+json'}})
            .then(response => {
                res.send(JSON.stringify(response.data, null, 2))
            })
            .catch(error => {
                res.send(error.response)
            });
    }
    catch(err){
        console.error("pete", err);
    }
});

app.get('/handle_twitch_callback', function (req, res) {
    const { error, error_description, error_uri } = req.query
    if (error) {
        res.status(500).json({
            error,
            error_description,
            error_uri
        })
    } else {
        console.log(req.session)
        res.end(JSON.stringify(req.session, null, 2))
    }
});

app.get('/', (req, res) => {
    res.status(200).send('La API funciona correctamente');
  });

const PORT = process.env.PORT || 5000

app.listen(PORT, function () {
    console.log('server running on port : 5000');
});
