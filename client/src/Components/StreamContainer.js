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
    overlayContainer: {
        '&:hover': {
            opacity: 1,
            cursor: 'pointer'
        },
        display: 'flex',
        opacity: 0
        
    },
    overlayContainerAnim: {
        display: 'flex',
        animation: '$cssAnimation 0s 2s forwards'
    },
    '@keyframes cssAnimation': {
        to: {
            opacity: 0
        }
    },
    overlayPopup: {
        position: 'relative',
        verticalAlign: 'middle',
        display: 'inline-block',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        width: '50%',
        background: 'rgba(0,0,0,.7)',
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
        allowFullScreen="true"
        scrolling="no"
        auto
        >
        </iframe>
    )
}

const ShowTwitch = (name) => {
    return (
            <iframe style = {{width: '100%', height: '100%', border: 'none'}}
            src= {`https://player.twitch.tv/?channel=${name}&muted=true&autoplay=true&parent=stream-gather.herokuapp.com`}
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

const StreamContainer =  ({name, provider, removeStream, selectChat, streamCount, setTeatherMode}) => {
    var classes = useStyles();
    const [animFinished, anim] = React.useState(false);
    setTimeout(() => {
        anim(true)
    }, 3000)
    return (
        <div className = {classes.container} style = {{flexBasis: `${streamCount === 2 ? '100%' : '50%'}`}}>
            {Selector(name, provider)}
            <div className = {animFinished ? classes.overlayContainer : classes.overlayContainerAnim} style = {{position: 'absolute', width: '100%', height: '15%'}}>
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