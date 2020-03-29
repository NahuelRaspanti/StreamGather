import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    container: {
        flex: 1,
        display: 'block',
        flexBasis: '50%',
        position: 'relative',
        height: '100%',
        width: '100%'
    }
  }));

const ShowMixer = (name) => {
    return (
        <iframe style = {{width: '100%', height: '100%'}}
        src= {`https://mixer.com/embed/chat/${name}`}
        height="100%"
        width="100%">
        </iframe>
    )
}

const ShowTwitch = (name) => {
    return (
            <iframe frameborder="0"
                scrolling="no"
                id="chat_embed"
                src={`https://www.twitch.tv/embed/${name}/chat?darkpopout`}
                height="100%"
                width="100%">
            </iframe>
    )
}



const ChatContainer =  ({name, provider, selectedChat}) => {
    var classes = useStyles();

    const Selector = () => {
        if(provider === 'twitch') {
            return ShowTwitch(name)
        }
        else if (provider === 'mixer'){
            return ShowMixer(name)
        }
    }

    return (
        <div className = {classes.container} style = {{display: `${selectedChat === name ? 'block' : 'none'}`}}>
            {Selector()}
        </div>
    )
}

export default ChatContainer;