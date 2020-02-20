import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { List, Avatar } from '@material-ui/core';

const DrawerStream = ({stream}) => {
    return(
    <ListItem button key={stream.id}>
        <ListItemIcon>
            <Avatar alt={"Avatar"} src={stream.avatar}></Avatar>
        </ListItemIcon>
        <ListItemText primary={stream.streamerName} secondary = {stream.game} />
    </ListItem>
    )
}

export default DrawerStream