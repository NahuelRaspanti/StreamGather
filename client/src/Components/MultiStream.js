import React from 'react';
import StreamContainer from './StreamContainer';
import ChatContainer from './ChatContainer';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    divBox: {
        bottom: '50px',
        display: 'flex',
        transform: 'translateX(-25%)',
        position: 'absolute', 
        backgroundColor: 'rgba(17,17,17,0.8)', 
        paddingLeft: '4px', 
        paddingRight: '4px',
        borderRadius: '8px',
        opacity: 0,
        '&:hover': {
            opacity: 1,
        }
    },
    divBoxAnim: {
        bottom: '50px',
        display: 'flex',
        transform: 'translateX(-25%)',
        position: 'absolute', 
        backgroundColor: 'rgba(17,17,17,0.8)', 
        paddingLeft: '4px', 
        paddingRight: '4px',
        borderRadius: '8px',
        animation: '$cssAnimation 0s 2s forwards'
    },
    '@keyframes cssAnimation': {
        to: {
            opacity: 0
        }
    },
    textControls: {
        padding: '4px',
        fontSize: '1.5em',
        '&:hover': {
            opacity: '0.5',
            cursor: 'pointer'
        }
    }
}));

const mapStreams = (selectStreams, removeStream, selectChat, setTeatherMode) => {
    return (selectStreams.map(selected => {
            return (
                <StreamContainer name = {selected.name} provider = {selected.provider} removeStream = {removeStream} selectChat = {selectChat} streamCount = {selectStreams.length} setTeatherMode = {setTeatherMode}></StreamContainer>
            )
        })
    )
}

const mapChat = (selectStreams, selectedChat) => {
    return (selectStreams.map(selected => {
        return (
            <ChatContainer name = {selected.name} provider = {selected.provider} selectedChat = {selectedChat}></ChatContainer>
        )
    })
)
}

const MultiStream =  ({selectedStreams, removeStream, selectChat, selectedChat, setTeatherMode, teatherMode, hideChat, isChatHidden}) => {
    var classes = useStyles();
    const [animFinished, anim] = React.useState(false);
    setTimeout(() => {
        anim(true)
    }, 5000)
    return (
        <div style = {{width: '100%', height: teatherMode ? '100vh' : 'calc(100vh - 64px)', padding: '0px', display: selectedStreams.length === 0 ? 'none' : 'flex'}}>
            <div style = {{width: isChatHidden ? '100%' : '80%', display: 'flex', flexFlow: 'wrap-reverse'}} >
                {mapStreams(selectedStreams, removeStream, selectChat, setTeatherMode)}
                <div className = {animFinished ? classes.divBox : classes.divBoxAnim} style = {{left: isChatHidden ? '50%' :'40%'}}>
                    <div className = {classes.textControls} onClick = {() => setTeatherMode()}>
                        Teather Mode
                    </div>
                    <div className = {classes.textControls} onClick = {() => hideChat()}>
                        {isChatHidden ? 'Show Chat' : 'Hide Chat'}
                    </div>
                </div>
            </div>
            <div style = {{width: isChatHidden ? '0%' : '20%'}}>
                {mapChat(selectedStreams, selectedChat)}
            </div>

        </div>
    )
}

export default MultiStream;