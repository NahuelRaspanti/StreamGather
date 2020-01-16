import React from 'react';
import axios from 'axios';
import StreamCard from './StreamCard'
import Grid from '@material-ui/core/Grid'
import { styled } from '@material-ui/core/styles';


const StreamGridStyled = styled(Grid)({
    height: 'auto'
  });

class StreamGrid extends React.Component {
    state = {streams: []};
    

    componentDidMount = async () => {
        const response = await axios.get('http://localhost:5000/get_twitch_streams',
        {withCredentials: true});

        this.setState({streams: response.data.streams});
    }

    render() {
        const streams = this.state.streams.map(stream => {
            return <StreamCard key={stream._id} stream = {stream}></StreamCard>
        });
        return (
            <StreamGridStyled container spacing={3}>{streams}</StreamGridStyled>
        )
    }
}

export default StreamGrid;