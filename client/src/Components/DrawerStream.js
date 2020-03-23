import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { List, Avatar, Typography } from '@material-ui/core';

const DrawerStream = ({stream, selectStream}) => {
    return(
    <ListItem style = {{paddingTop: '0px', paddingBottom: '0px'}} button key={stream.id} component = "button" onClick = {() => selectStream(stream.streamerName, stream.provider)}>
        <ListItemIcon>
            <Avatar alt={"Avatar"} src={stream.avatar} ></Avatar>
        </ListItemIcon>
        <ListItemText primary={stream.streamerName} secondary = {
            <p style = {{margin: '0px', overflow: 'hidden', textOverflow: 'ellipsis'}} variant = "caption">{stream.game}</p>}/>
    </ListItem>

    )
}

export default DrawerStream