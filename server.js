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
    origin: process.env.NODE_ENV === 'production' ? 'stream-gather.herokuapp.com' :'http://localhost:3000',
    credentials: true
}));

mongoose.connect(process.env.MONGO_DB)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));;

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Client-ID'] = process.env.TWITCH_KEY;
axios.defaults.headers.post['Content-Type'] = 'application/vnd.twitchtv.v5+json'

app.use(session({secret: 'grant', resave: false, saveUninitialized: false, cookie: {maxAge: 1000*60*60*24*30*12 }, store: new MongoStore({mongooseConnection: mongoose.connection})}));

const grantConfig = 
{
    "development": {
        "defaults": {
            "protocol": "http",
            "host": "localhost:3000",
            "transport": "session",
            "state": true
        },
        "twitch": {
            "key": process.env.TWITCH_KEY,
            "secret": process.env.TWITCH_SECRET,
            "scope": ["user_read"],
            "callback": "http://localhost:3000/api/handle_twitch_callback"
        },
        "mixer": {
            "key": process.env.MIXER_KEY,
            "secret": process.env.MIXER_SECRET,
            "callback": "/api/handle_mixer_callback"
        }
    },
    "production": {
        "defaults": {
            "protocol": "https",
            "host": "stream-gather.herokuapp.com",
            "transport": "session",
            "state": true
        },
        "twitch": {
            "key": process.env.TWITCH_KEY,
            "secret": process.env.TWITCH_SECRET,
            "scope": ["user_read"],
            "callback": "https://stream-gather.herokuapp.com/api/handle_twitch_callback"
        },
        "mixer": {
            "key": process.env.MIXER_KEY,
            "secret": process.env.MIXER_SECRET,
            "callback": "https://stream-gather.herokuapp.com/api/handle_mixer_callback"
        }
    }
}

app.use(grant(grantConfig[process.env.NODE_ENV || 'development']))

app.get('/api/get_mixer_streams', async function (req, res) {
    try {
        if(req.session.user.mixerId !== null) {
            await axios.get('https://mixer.com/api/v1/users/'+ req.session.user.mixerId +'/follows?where=online:eq:true')
            .then(response => {
                return res.send(response.data)
            })
            .catch(async error => {
                if(error.response.status === 401 && error.response.statusText === "Unauthorized"){
                    var refreshedUser = await refreshTwitchToken(req.session.user.mixerId, req.session.user.mixerRefresh)
                    req.session.user = refreshedUser
                    return res.redirect('/get_mixer_streams')
                }
            })
        }
        else {
            return res.send({});
        }
    }
    catch (err){
        console.log(err)
    }
})

app.get('/api/get_twitch_streams', async function (req, res) {
    try{
        if(req.session.user.twitchId !== null) {
            await axios.get('https://api.twitch.tv/kraken/streams/followed',
                 {headers : {'Authorization': 'OAuth ' + req.session.user.twitchAccess, 'Accept': 'application/vnd.twitchtv.v5+json'}})
                .then(response => {
                    return res.send(response.data)
                })
                .catch(async error => { //Manejar el 401 Unauthorized para refreshear el token y guardar el nuevo
                    if(error.response.status === 401 && error.response.statusText === "Unauthorized"){
                        var refreshedUser = await refreshTwitchToken(req.session.user.twitchId, req.session.user.twitchRefresh)
                        req.session.user = refreshedUser
                        return res.redirect('/get_twitch_streams')
                    }
            });
        }
        else {
            return res.send({});
        }
        
    }
    catch(err){
        console.error("pete", err);
    }
});

app.get('/api/handle_twitch_callback', async function (req, res) {
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
                var id =  user === null ? req.session.user._id : user.id
                var user = await updateUser(id, req.session.grant.response, resp.data._id, 'twitch')
            }
            else{
                var user = createUser(resp.data._id, req.session.grant.response, 'twitch')
            }      
            req.session.user = user
            return res.redirect("/");
        })
        .catch(err => {
            res.end(err);
        })
    }
});

app.get('/api/handle_mixer_callback', async function (req, res) {
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
            if(req.session.user || user){
                var id =  user === null ? req.session.user._id : user.id
                var user = await updateUser(id, req.session.grant.response, resp.data.id, 'mixer')
            }
            else{
                var user = createUser(resp.data.id, req.session.grant.response, 'mixer')
            }      
            req.session.user = user
            return res.redirect("/");
        })
        .catch(err => {
            res.end(err);
        })
    }
});

app.post('/api/logout/:provider', (req, res) => {
    try{
        const provider = req.params.provider
        req.session.user[`${provider}Id`] = null
        req.session.user[`${provider}Access`] = null
        req.session.user[`${provider}Refresh`] = null
    
        const user = req.session.user
    
        User
        .updateOne({_id: user._id}, user)
        .exec()
        .then(resp => {
            res.send(200)
        })
        .catch(err => {
            console.log(err)
        })

    }
    catch (err){
        console.log(err)
    }
});

const refreshTwitchToken = async (twitchId, twitchRefresh) => {
    return await axios.post('https://id.twitch.tv/oauth2/token', '', {
        params: {
            grant_type: "refresh_token",
            refresh_token: twitchRefresh,
            client_id: process.env.TWITCH_KEY,
            client_secret: process.env.TWITCH_SECRET
        }
    })
    .then(async response => {
        var refreshedUser = await refreshAccessToken(response.data, twitchId, 'twitch')
        return refreshedUser
    })
    .catch(err => {
        return err.response;
    })
}

const refreshMixerToken = async (mixerId, mixerRefresh) => {
    var instance = axios.create({
        baseURL: 'https://mixer.com',
        headers: {'Accept': '*/*', 'Content-Type': 'application/json; charset=utf-8'}
    })

    return await instance.post('/api/v1/oauth/token', {
            grant_type: "refresh_token",
            refresh_token: mixerRefresh,
            client_id: process.env.MIXER_KEY,
            client_secret: process.env.MIXER_SECRET
    }, '')
    .then(async response => {
        var refreshedUser = await refreshAccessToken(response.data, mixerId, 'mixer')
        return refreshedUser
    })
    .catch(err => {
        console.log(err);
    })
}

const refreshAccessToken = async (data, id, provider) => {
    var user = User
    .findByIdAndUpdate({_id: id}, {[`${provider}Access`]: data.access_token, [`${provider}Refresh`]: data.refresh_token}, {new: true})
    .exec()
    .then(user => {
        return user;
    })
    .catch(err => {
        console.log(err);
    })
    return user;
}

const findUser = async (providerId, provider) => {
    var user = User
    .findOne({[`${provider}Id`]: providerId})
    .exec()
    .then(user => {
        return user;
    })
    .catch(err => {
        console.log(err);
    })
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

app.get('/api/fetch_current_user', async (req, res) => {
    const userVar = req.session.user;
    if(userVar === undefined) {
        res.send({});
        return;
    } 
    const emptyUser = {username: undefined, avatarUrl: undefined};
    const mixerUser = req.session.user.mixerId ? await fetchMixerUser(req, userVar.mixerAccess, userVar._id, userVar.mixerRefresh) : emptyUser;
    const twitchUser = req.session.user.twitchId ? await fetchTwitchUser(req, userVar.twitchAccess, userVar._id, userVar.twitchRefresh) : emptyUser;
    newMixer = { username: mixerUser.username, avatarUrl: mixerUser.avatarUrl};
    newTwitch =  {username: twitchUser.display_name, avatarUrl: twitchUser.logo};

    var user = [req.session.user, newTwitch, newMixer];
    res.send(user);
});


const fetchTwitchUser = async (req, access, userId, refresh) => {
    return await axios.get('https://api.twitch.tv/kraken/user', {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': process.env.TWITCH_KEY,
            'Authorization': 'OAuth ' + access
        }
    })
    .then(response => {
        return response.data;
    })
    .catch(async err => {
        if(err.response.status === 401 && err.response.statusText === "Unauthorized"){
            var refreshedUser = await refreshTwitchToken(userId, refresh)
            if (refreshedUser === undefined) return;
            req.session.user = refreshedUser;
            return twitchUser = await fetchTwitchUser(req, refreshedUser.twitchAccess, userId, refreshedUser.twitchRefresh);
        }
    })
}

const fetchMixerUser = async (req, access, userId, refresh) => {
    return await axios.get('https://mixer.com/api/v1/users/current', {
            headers: {
                'Authorization': 'Bearer ' + access
            }
    })
    .then(response => {
        return response.data;
    })
    .catch(async err => {
        if(err.response.status === 401 && err.response.statusText === "Unauthorized") {
            const refreshedUser = await refreshMixerToken(userId, refresh)
            if(refreshedUser === undefined) return;
            req.session.user = refreshedUser;
            return mixerUser = await fetchMixerUser(req, refreshedUser.twitchAccess, userId, refreshedUser.twitchRefresh);
        }
    })
}

if(process.env.NODE_ENV === 'production'){
    // serve production assets e.g. main.js if route exists
    app.use(express.static('client/build'));

    // serve index.html if route is not recognized
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
    });
}


const PORT = process.env.PORT || 5000

app.listen(PORT, function () {
    console.log('server running on port : ' + PORT);
});
