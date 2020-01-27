import React from 'react';
import Card from '@material-ui/core/Card';
import { Grid, Avatar, Typography } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
      primary: { main: "#e91e63", contrastText: "#fff" },
      secondary: { main: "#03a9f4", contrastText: "#fff" }
    }
  });

const StreamCard = ({stream}) => {
    return(
    <Grid item xs = {2} >
        <Card>
            <div style = {{position: 'relative'}}>
            <img src = {stream.image} style = {{maxWidth: '100%', height: 'auto'}}></img>
            <div style = {{top: '12px', left: '4px', position: 'absolute', display: 'flex'}}>
                <Typography variant = "caption" color = "inherit" >{stream.viewers} viewers</Typography>
            </div>
            </div>
            <div>
                <Avatar alt={"Avatar"} src={stream.avatar} style={{position: 'absolute', marginLeft: '20px'}}></Avatar>
                <h4>{stream.streamerName}</h4>
                <h6>{stream.game}</h6>
            </div>
    </Card>
    </Grid>
    ) 
}

export default StreamCard;