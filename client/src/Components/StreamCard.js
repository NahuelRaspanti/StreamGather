import React from 'react';
import Card from '@material-ui/core/Card';
import { Grid, Avatar, Typography, Box, Link, SvgIcon } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import twitch from '../Images/twitch.jpg'
import {ReactComponent as TwitchSVG} from '../Images/twitchsvg.svg'
import {ReactComponent as MixerSVG} from '../Images/mixersvg.svg'

const styles = {
    divBox: {
        top: '12px',
        left: '4px', 
        position: 'absolute', 
        display: 'flex', 
        backgroundColor: 'rgba(17,17,17,0.8)', 
        paddingLeft: '4px', 
        paddingRight: '4px',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
        borderBottomRightRadius: '4px',
        borderBottomLeftRadius: '4px'
    }
}

const providerIcon = (provider) => {
    if(provider === 'twitch') {
        return <TwitchSVG style = {{top: '12px', right: '8px', position: 'relative', display: 'block', backgroundSize: '40px 40px'}}></TwitchSVG>
    }
    return <MixerSVG style = {{top: '12px', right: '8px', position: 'relative', display: 'block', backgroundSize: '40px 40px'}}></MixerSVG>
}

const StreamCard = ({stream}) => {
    return(
    <Grid item xs = {3} >
        <Card>
            <Link href = {stream.url} target = "_blank" color="inherit" style={{textDecoration: 'none'}}>
            <div style = {{position: 'relative'}}>
                <img src = {stream.image} style = {{width: '100%', height: 'auto', verticalAlign: 'middle'}}></img>
                <div style = {styles.divBox}>
                    <span style = {{color: 'white'}}>{stream.viewers} viewers</span>
                </div>
            </div>
            <div style = {{padding: '16px', alignItems: 'center', display: 'flex', flexGrow: '1'}}>
                <Avatar alt={"Avatar"} src={stream.avatar} style={{position: 'relative', display: 'block', width: '52px', height: '52px'}}></Avatar>
                <div style = {{width: '0px', marginLeft: '8px', flexGrow: '1', textAlign: 'left'}}>
                    <Typography variant = "subtitle1" component = "div">
                        <Box fontWeight = "fontWeightBold" textOverflow="ellipsis" overflow="hidden" whiteSpace="noWrap">
                            {stream.title}
                        </Box>
                    </Typography>
                    <Typography variant = "caption" component = "p">{stream.streamerName}</Typography>
                    <Typography variant = "caption" component = "p">{stream.game}</Typography>
                </div>
                {providerIcon(stream.provider)}
            </div>
            </Link>
        </Card>
    </Grid>
    ) 
}

export default StreamCard;