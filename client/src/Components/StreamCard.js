import React from 'react';
import Card from '@material-ui/core/Card';
import { Grid, Avatar } from '@material-ui/core';

const StreamCard = ({stream}) => {
    return(
    <Grid item xs = {3} >
        <Card style={{ width: '300px' }}>
        <img src = {stream.preview.medium}></img>
        <div>
            <Avatar alt={"Avatar"} src={stream.channel.logo} style={{position: 'absolute', marginLeft: '5px'}}></Avatar>
            <h4>{stream.channel.display_name}</h4>
            <h6>{stream.channel.game}</h6>
        </div>
        </Card>
    </Grid>
    ) 
}

export default StreamCard;