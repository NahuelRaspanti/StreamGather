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
        const {streams, selectStream} = this.props;

        const strs = streams.map(stream => {
            return <StreamCard key={stream.id} stream = {stream} selectStream = {selectStream}></StreamCard>
        });
        return (
            <div style = {{padding: '5px', width: '100%'}}>
            <StreamGridStyled container spacing={1}>{strs}</StreamGridStyled>
            </div>
        )
    }
}

export default StreamGrid