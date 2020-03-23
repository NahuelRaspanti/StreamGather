import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    container: {
        flex: 1,
        display: 'flex',
        flexBasis: '50%',
        position: 'relative'
    },
    overlayPopup: {
        position: 'relative',
        verticalAlign: 'middle',
        display: 'inline-block',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: '150px',
        width: '50%',
        opacity: 0,
        transition: theme.transitions.create('height', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        background: 'rgba(0,0,0,.7)',
        '&:hover': {
            opacity: 100,
            cursor: 'pointer'
        }
    },
    text: {
        position: 'relative',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) translateY(-50%)'
    }
  }));

const ShowMixer = (name) => {
    return (
        <iframe style = {{width: '100%', height: '100%'}}
        src= {`https://mixer.com/embed/player/${name}`}
        height="640"
        width="390"
        >
        </iframe>
    )
}

const ShowTwitch = (name) => {
    return (
            <iframe style = {{width: '100%', height: '100%', border: 'none'}}
            src= {`https://player.twitch.tv/?channel=${name}&muted=true&autoplay=true`}
            frameborder="0"
            height="640"
            width="390"
            scrolling="no"
            auto
            allowfullscreen="true">
            </iframe>
    )
}

const Selector = (name, provider) => {
    if(provider === 'twitch') {
        return ShowTwitch(name)
    }
    else if (provider === 'mixer'){
        return ShowMixer(name)
    }
}

const StreamContainer =  ({name, provider, removeStream, selectChat}) => {
    var classes = useStyles();
    return (
        <div className = {classes.container}>
            {Selector(name, provider)}
            <div style = {{display: 'flex', position: 'absolute', width: '100%'}}>
                <div className = {classes.overlayPopup} onClick = {() => removeStream(name)}>
                    <Typography className = {classes.text}>
                    REMOVE STREAM
                    </Typography>
                </div>
                <div className = {classes.overlayPopup} onClick = {() => selectChat(name)}>
                    <Typography className = {classes.text}>
                    SELECT CHAT
                    </Typography>
                </div>
            </div>
        </div>
    )
}

export default StreamContainer;