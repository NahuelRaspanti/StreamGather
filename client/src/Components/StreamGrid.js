import React from 'react';
import axios from 'axios';
import StreamCard from './StreamCard'
import Grid from '@material-ui/core/Grid'
import { styled } from '@material-ui/core/styles';


const StreamGridStyled = styled(Grid)({
    height: 'auto'
  });

class StreamGrid extends React.Component {
    state = {streams: [], user: []};

    getCurrentUser = async () => {
        if(this.state.user.length > 0){
            return this.user
        }
        var user = await axios.get('/api/fetch_current_user',
        {withCredentials: true});

        this.setState({user: user.data})

        return user.data;
    }
    
    getTwitchStreams = async () => {
        const response = await axios.get('/api/get_twitch_streams',
        {withCredentials: true});

        var parsedData = response.data.streams.map(str => {
            var streams = {image: str.preview.medium, avatar: str.channel.logo, streamerName: str.channel.display_name, game: str.channel.game, viewers: str.viewers, title: str.channel.status, url: str.channel.url, provider: 'twitch'};
            return streams;
        })

        return parsedData;
    }

    getMixerStreams = async () => {
        const response = await axios.get('/api/get_mixer_streams',
        {withCredentials: true});

        if(response.data.length === undefined) return {}
        var parsedData = response.data.map(str => {
            var streams = {image: 'https://thumbs.mixer.com/channel/'+ str.id +'.small.jpg', avatar: str.user.avatarUrl, streamerName: str.user.username, game: str.type.name, viewers: str.viewersCurrent, title: str.name, url: 'https://mixer.com/' + str.user.username, provider: 'mixer'};
            return streams;
        })

        return parsedData;
    }

    componentDidMount = async () => {
        var twitchStreams = {}
        var mixerStreams = {}
        var streams = {}
        var user = await this.getCurrentUser();
        if(user.twitchAccess)
        twitchStreams = await this.getTwitchStreams();
        if(user.mixerAccess)
        mixerStreams = await this.getMixerStreams();

        if(twitchStreams.length !== undefined || mixerStreams.length !== undefined)
        {
            if(mixerStreams.length > 0){
                streams =  mixerStreams.concat(twitchStreams)
            }
            else {
                streams = twitchStreams.concat(mixerStreams)
            }
            var streamsOrdered = streams.filter(e => {
                return Object.keys(e).length !== 0
            })
            .sort((a, b) => {
                return b.viewers - a.viewers 
            })

            this.setState({streams: streamsOrdered})
        }
        
    }

    render() {
        const streams = this.state.streams.map(stream => {
            return <StreamCard key={stream._id} stream = {stream}></StreamCard>
        });
        return (
            <div style = {{padding: '5px'}}>
            <StreamGridStyled container  spacing={1}>{streams}</StreamGridStyled>
            </div>
        )
    }
}

export default StreamGrid;