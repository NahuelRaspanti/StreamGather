import React from 'react';
import StreamContainer from './StreamContainer';
import ChatContainer from './ChatContainer';
import { selectStream } from '../actions';

const mapStreams = (selectStreams, removeStream, selectChat) => {
    return (selectStreams.map(selected => {
            return (
                <StreamContainer name = {selected.name} provider = {selected.provider} removeStream = {removeStream} selectChat = {selectChat} streamCount = {selectStreams.length}></StreamContainer>
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

const MultiStream =  ({selectedStreams, removeStream, selectChat, selectedChat}) => {
    return (
        <div style = {{width: '100%', height: 'calc(100vh - 64px)', padding: '0px', display: `${selectedStreams.length === 0 ? 'none' : 'flex'}`}}>
            <div style = {{width: '100%', height: 'calc(100vh - 64px)', display: 'flex', padding: '0px', flexFlow: 'wrap-reverse'}} >
                {mapStreams(selectedStreams, removeStream, selectChat)}
            </div>
            <div>
                {mapChat(selectedStreams, selectedChat)}
            </div>
        </div>
    )
}

export default MultiStream;