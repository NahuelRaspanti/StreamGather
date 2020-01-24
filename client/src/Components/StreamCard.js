import React from 'react';
import Card from '@material-ui/core/Card';
import { Grid, Avatar, Container } from '@material-ui/core';

const StreamCard = ({stream}) => {
    return(
    <Grid item xs = {3} >
        <Card>
        <Container>
            <img src = {stream.image}></img>
            <div>
                <Avatar alt={"Avatar"} src={stream.avatar} style={{position: 'absolute', marginLeft: '5px'}}></Avatar>
                <h4>{stream.streamerName}</h4>
                <h6>{stream.game}</h6>
            </div>
        </Container>
        </Card>
    </Grid>
    ) 
}

export default StreamCard;