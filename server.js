const express = require("express");
const grant = require("grant-express");
const cors = require("cors");
const session = require("express-session");

require('dotenv').config();

var app = express();

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
