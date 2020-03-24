import React from 'react';
import StreamContainer from './StreamContainer';
import ChatContainer from './ChatContainer';

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

const MultiStream =  ({selectedStreams, removeStream, selectChat, selectedChat, setTeatherMode, teatherMode}) => {
    return (
        <div style = {{width: '100%', height: `${teatherMode ? '100vh' : 'calc(100vh - 64px)'}`, padding: '0px', display: `${selectedStreams.length === 0 ? 'none' : 'flex'}`}}>
            <div style = {{width: '100%', display: 'flex', flexFlow: 'wrap-reverse'}} >
                {mapStreams(selectedStreams, removeStream, selectChat, setTeatherMode)}
            </div>
            <div>
                {mapChat(selectedStreams, selectedChat)}
            </div>
        </div>
    )
}

export default MultiStream;