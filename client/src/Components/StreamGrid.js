import React from 'react';
import StreamCard from './StreamCard'
import Grid from '@material-ui/core/Grid'
import { styled } from '@material-ui/core/styles';


const StreamGridStyled = styled(Grid)({
    height: 'auto',
    display: 'flex'
  });

class StreamGrid extends React.Component {
    render() {
        const {streams} = this.props;

        const strs = streams.map(stream => {
            return <StreamCard key={stream.id} stream = {stream}></StreamCard>
        });
        return (
            <div style = {{padding: '5px'}}>
            <StreamGridStyled container spacing={1}>{strs}</StreamGridStyled>
            </div>
        )
    }
}

export default StreamGrid