const express = require("express");
const grant = require("grant-express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require('mongoose');
const userSchema = require('./models/user');
const MongoStore = require('connect-mongo')(session);

const axios = require("axios").default;
var Schema = mongoose.Schema;

const User = mongoose.model('user', userSchema);

require('dotenv').config();

var app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

mongoose.connect(process.env.MONGO_DB);

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Client-ID'] = process.env.TWITCH_KEY;
axios.defaults.headers.post['Content-Type'] = 'application/vnd.twitchtv.v5+json'

app.use(session({secret: 'grant', resave: false, saveUninitialized: false, cookie: {maxAge: 1000*60*60*24*30*12 }, store: new MongoStore({mongooseConnection: mongoose.connection})}));

const grantConfig = 
{
    "development": {
        "defaults": {
            "protocol": "http",
            "host": "localhost:5000",
            "transport": "session",
            "state": true
        },
        "twitch": {
            "key": process.env.TWITCH_KEY,
            "secret": process.env.TWITCH_SECRET,
            "scope": ["user_read"],
            "callback": "http://localhost:3000/handle_twitch_callback"
        },
        "mixer": {
            "key": process.env.MIXER_KEY,
            "secret": process.env.MIXER_SECRET,
            "callback": "http://localhost:3000/handle_mixer_callback"
        }
    },
    "production": {
        "defaults": {
            "protocol": "https",
            "host": "localhost:5000",
            "transport": "session",
            "state": true
        },
        "twitch": {
            "key": process.env.TWITCH_KEY,
            "secret": process.env.TWITCH_SECRET,
            "scope": ["user_read"],
            "callback": "https://localhost:3000/handle_twitch_callback"
        },
        "mixer": {
            "key": process.env.MIXER_KEY,
            "secret": process.env.MIXER_SECRET,
            "callback": "http://localhost:3000/handle_mixer_callback"
        }
    }
}

app.use(grant(grantConfig[process.env.NODE_ENV || 'development']))

app.get('/get_mixer_streams', async function (req, res) {
    try {
        await axios.get('https://mixer.com/api/v1/users/'+ req.session.user.mixerId +'/follows?where=online:eq:true')
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
             {headers : {'Authorization': 'OAuth ' + req.session.user.twitchAccess, 'Accept': 'application/vnd.twitchtv.v5+json'}})
            .then(response => {
                res.send(response.data)
            })
            .catch(async error => { //Manejar el 401 Unauthorized para refreshear el token y guardar el nuevo
                if(error.response.status === 401 && error.response.statusText === "Unauthorized"){
                    var refreshedUser = await refreshTwitchToken(req.session.user.twitchId, req.session.user.twitchRefresh)
                    req.session.user = refreshedUser
                    res.redirect('/get_twitch_streams')
                }
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
        await axios.get('https://api.twitch.tv/kraken/user', {
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': process.env.TWITCH_KEY,
                'Authorization': 'OAuth ' + req.session.grant.response.access_token
            }
        })
        .then(async resp => {
            user = await findUser(resp.data._id, 'twitch')
            if(req.session.user || user){
                var id =  user.id || req.session.user._id
                var user = await updateUser(id, req.session.grant.response, resp.data._id, 'twitch')
            }
            else{
                var user = createUser(resp.data._id, req.session.grant.response, 'twitch')
            }      
            req.session.user = user
            res.redirect("/");
        })
        .catch(err => {
            res.end(err);
        })
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
        .then(async resp => {
            user = await findUser(resp.data.id, 'mixer')
            if(req.session.user._id === undefined || user){
                var id = req.session.user._id ? req.session.user._id : user.id
                var user = await updateUser(req.session.user._id, req.session.grant.response, resp.data.id, 'mixer')
            }
            else{
                var user = createUser(resp.data.id, req.session.grant.response, 'mixer')
            }      
            req.session.user = user
            res.redirect("/");
        })
        .catch(err => {
            res.end(err);
        })
    }
});

const refreshTwitchToken = async (twitchId, twitchRefresh) => {
    await axios.post('https://id.twitch.tv/oauth2/token', {
        params: {
            grant_type: "refresh_token",
            refresh_token: twitchRefresh,
            client_id: process.env.TWITCH_KEY,
            client_secret: process.env.TWITCH_SECRET
        }
    })
    .then(async response => {
        var refreshedUser = await refreshAccessToken(response.data, twitchId)
        return refreshedUser
    })
    .catch(err => {
        return err.response;
    })
}

const refreshAccessToken = async (data, id) => {
    var user = User.findByIdAndUpdate({_id: id}, {twitchAccess: data.access_token, twitchRefresh: data.refresh_token}, {new: true}).exec()
    return user;
}

const findUser = async (providerId, provider) => {
    var user = User.findOne({[`${provider}Id`]: providerId}).exec()
    return user;
}

const createUser = (providerId, sessionData, provider) => {
    var user = new User({[`${provider}Access`]: sessionData.access_token, [`${provider}Refresh`]: sessionData.refresh_token, [`${provider}Id`]: providerId})
    user.save(function (err) {
        if(err) return;
    });
    return user;
}

const updateUser = async (id, sessionData, providerId, provider) => {
    var user = User.findByIdAndUpdate({_id: id}, {[`${provider}Access`]: sessionData.access_token, [`${provider}Refresh`]: sessionData.refresh_token, [`${provider}Id`]: providerId}, {new: true}).exec()
    return user;
}

app.get('/fetch_current_user', (req, res) => {
    res.send(req.session.user)
});

app.get('/', (req, res) => {
    res.status(200).send('La API funciona correctamente');
  });

const PORT = process.env.PORT || 5000

app.listen(PORT, function () {
    console.log('server running on port : 5000');
});
