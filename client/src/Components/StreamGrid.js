import React from 'react';
import StreamCard from './StreamCard'
import Grid from '@material-ui/core/Grid'
import { styled } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import _ from 'lodash'
import { Card } from '@material-ui/core';


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

        const Skel = () => {
            return (
                <Grid item xs = {12} xl = {2} lg = {2} md = {4} sm = {4}>
                    <Card style = {{maxWidth: '400px', width: '100%', minWidth: '200px'}}>
                        <Skeleton variant="rect" width= "100%" height= {150} animation="wave"></Skeleton>
                        <div style = {{display: 'flex', padding: '8px'}}>
                        <div style = {{flex: '0 0 auto'}}>
                            <Skeleton animation="wave" variant="circle" width={38} height={38} />
                        </div>
                        <div style = {{flex: '1 1 auto', marginLeft: '8px'}}>
                            <Skeleton animation="wave" height={10} width="70%" style={{ marginBottom: 6 }} />
                            <Skeleton animation="wave" height={10} width="70%" style={{ marginBottom: 6 }} />
                            <Skeleton animation="wave" height={10} width="70%" style={{ marginBottom: 6 }} />
                        </div>
                        </div>
                    </Card>
                </Grid>
            )
        }

        const renderGrid = () => {
            var skels = []
            if(streams.length === 0){
                _.times(15, () => { skels.push(Skel())})
                return(
                <div style = {{padding: '5px', width: '100%'}}>
                    <StreamGridStyled container spacing={1}>{skels}</StreamGridStyled>
                </div>
                )
            }
            else{
                return(
                <div style = {{padding: '5px', width: '100%'}}>
                    <StreamGridStyled container spacing={1}>{strs}</StreamGridStyled>
                </div>
                )
            }
        }

        return (
            renderGrid()
        )
    }
}

export default StreamGrid