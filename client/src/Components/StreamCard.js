import React from 'react';
import Card from '@material-ui/core/Card';
import { Grid, Avatar, Typography, Box, IconButton, Tooltip, CardActionArea } from '@material-ui/core';
import {ReactComponent as TwitchSVG} from '../Images/twitchsvg.svg'
import {ReactComponent as MixerSVG} from '../Images/mixersvg.svg'
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

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
    },
    openInNewIcon: {
        padding: '0px'
    },
    divIcon: {
        backgroundColor: 'rgba(17,17,17,0.8)', 
        paddingLeft: '4px', 
        paddingRight: '4px',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
        borderBottomRightRadius: '4px',
        borderBottomLeftRadius: '4px',
        top: '12px',
        right: '4px',
        position: 'absolute',
        display: 'flex'
    }
}

const providerIcon = (provider) => {
    if(provider === 'twitch') {
        return <TwitchSVG style = {{top: '12px', right: '8px', position: 'relative', display: 'block', backgroundSize: '30px 30px'}}></TwitchSVG>
    }
    return <MixerSVG style = {{top: '12px', right: '8px', position: 'relative', display: 'block', backgroundSize: '30px 30px'}}></MixerSVG>
}

const StreamCard = ({stream, selectStream}) => {
    return(
    <Grid item xs = {12} xl = {2} lg = {2} md = {4} sm = {4} >
        <Card style = {{maxWidth: '400px', width: '100%', minWidth: '200px', cursor: 'pointer'}}>
            <div style = {{position: 'relative', zIndex: '99'}}>
                <div style = {styles.divBox}>
                    <span style = {{color: 'white'}}>{stream.viewers} viewers</span>
                </div>
                <div style = {styles.divIcon}>
                    <Tooltip title = "Open in a new tab">
                            <IconButton style = {styles.openInNewIcon} href = {stream.url} target = "_blank">
                                <OpenInNewIcon></OpenInNewIcon>
                            </IconButton>
                    </Tooltip>
                </div>
            </div>
            <CardActionArea onClick = {e => {e.preventDefault(); selectStream(stream.streamerName, stream.provider);}} title = {stream.title}>
            <div style = {{position: 'relative'}}>
                <img alt = {[`${stream.streamerName} image`]} src = {stream.image} style = {{width: '100%', height: 'auto', verticalAlign: 'middle'}}></img>
            </div>
            <div style = {{padding: '8px', alignItems: 'center', display: 'flex', flexGrow: '1'}}>
                <Avatar alt={"Avatar"} src={stream.avatar} style={{position: 'relative', display: 'block', width: '38px', height: '38px'}}></Avatar>
                <div style = {{width: '0px', marginLeft: '8px', flexGrow: '1', textAlign: 'left'}}>
                    <Typography variant = "subtitle1" component = "div" style = {{fontSize: '0.9rem'}}>
                        <Box fontWeight = "fontWeightBold" textOverflow="ellipsis" overflow="hidden" whiteSpace="noWrap">
                            {stream.title}
                        </Box>
                    </Typography>
                    <Typography variant = "caption" component = "p" noWrap>{stream.streamerName}</Typography>
                    <Typography variant = "caption" component = "p" noWrap>{stream.game}</Typography>
                </div>
                {providerIcon(stream.provider)}
            </div>
            </CardActionArea>
        </Card>
    </Grid>
    ) 
}

export default StreamCard;