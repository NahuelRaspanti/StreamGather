const express = require("express");
const grant = require("grant-express");
const cors = require("cors");
const session = require("express-session");
var mongoose = require('mongoose');
const userModel = require('./models/user');

const axios = require("axios").default;
var Schema = mongoose.Schema;

require('dotenv').config();

var app = express();

app.use(cors());

mongoose.connect('mongodb+srv://admin:4fGW6T2zgoCbkHHk@cluster0-nsozd.gcp.mongodb.net/test?retryWrites=true&w=majority', {useMongoClient: true});

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


app.get('/get_twitch_streams', async function (req, res) {
    try{
        await axios.get('https://api.twitch.tv/kraken/streams/followed',
             {headers : {'Authorization': 'OAuth ' + 'c40npqm4u8dzj26uoexzpz23rs7hsc', 'Accept': 'application/vnd.twitchtv.v5+json'}})
            .then(response => {
                res.send(response.data)
            })
            .catch(error => {
                res.send(error.response)
            });
    }
    catch(err){
        console.error("pete", err);
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
        await axios.get('https://api.twitch.tv/kraken/user', 
        {
            headers: 
            {
                'Authorization': 'OAuth ',
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        })
        .then(res => {
            const user = new userModel({
                twitchId: res.data._id,
                twitchAccess: req.session.grant.response.access_token,
                twitchRefresh: req.session.grant.response.refresh_token
            })
            userModel.updateOne({twitchId: user.twitchId}, {})

        })
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
