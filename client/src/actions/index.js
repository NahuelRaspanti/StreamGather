import axios from 'axios';
import _ from 'lodash';

export const fetchUser = () => async dispatch => {
    const response = await axios.get('/api/fetch_current_user',
    {withCredentials: true});
    
    dispatch({ type: 'FETCH_USER', payload: response.data})
}

export const logout = (provider) => async dispatch => {
    await axios.post('/api/logout/' + provider,
    {withCredentials: true});

    dispatch(fetchUser());
    dispatch(fetchStreams());
}

export const fetchStreams = () => async dispatch => {
    var twitchStreams = await fetchTwitchStreams();
    var mixerStreams = await fetchMixerStreams();

    var streamsOrdered = _(twitchStreams).concat(mixerStreams).filter(_.size).orderBy('viewers', "desc").value();

    dispatch({ type: 'FETCH_STREAMS', payload: streamsOrdered});
}

export const selectStream = (name, provider) => (dispatch, getState) => {
    var state = getState();
    var streams = state.streams.selectedStreams;
    if(_.find(streams, e => {return e.name === name})) return;
    if(streams.length < 4 && streams.length === 0 ) {
        dispatch({type: 'SELECT_STREAM', payload: {name, provider}})
        dispatch({ type: 'SELECT_CHAT', payload: name})
    }
    else {
        dispatch({type: 'SELECT_STREAM', payload: {name, provider}})
    }
}

export const removeStream = (name) => (dispatch, getState) => {
    var state = getState();
    var streams = state.streams.selectedStreams;
    var payload = _.filter(streams, e => {
        return e.name !== name
    })
    dispatch({type: 'REMOVE_STREAM', payload: payload})
    dispatch({ type: 'SELECT_CHAT', payload: payload[0].name})
}

export const selectChat = (name) => dispatch => {
    dispatch({ type: 'SELECT_CHAT', payload: name})
}   

const fetchTwitchStreams = async () => {
    const response = await axios.get('/api/get_twitch_streams',
    {withCredentials: true});

    if(_.isEmpty(response.data)) return []

    var parsedData = response.data.streams.map(str => {
        var streams = {id: str._id, image: str.preview.medium, avatar: str.channel.logo, streamerName: str.channel.display_name, game: str.channel.game, viewers: str.viewers, title: str.channel.status, url: str.channel.url, provider: 'twitch'};
        return streams;
    })

    return parsedData;
}

const fetchMixerStreams = async () => {
    const response = await axios.get('/api/get_mixer_streams',
    {withCredentials: true});

    if(_.isEmpty(response.data)) return []

    var parsedData = response.data.map(str => {
        var streams = {id: str.id, image: 'https://thumbs.mixer.com/channel/'+ str.id +'.small.jpg', avatar: str.user.avatarUrl, streamerName: str.user.username, game: str.type.name, viewers: str.viewersCurrent, title: str.name, url: 'https://mixer.com/' + str.user.username, provider: 'mixer'};
        return streams;
    })

    return parsedData;
}