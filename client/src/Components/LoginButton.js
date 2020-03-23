import React from 'react';
import { Avatar, Typography } from '@material-ui/core';
import _ from 'lodash'

const LoginButton = ({app, user}) => {
    const {name, href, text, color} = app;
    const userProfile = name === "Twitch" ? user.user[1] : user.user[2];

    const shouldShowProfile = () => {
        var usr = user.user[0];
        if(_.isEmpty(usr)) return false;
        if(name === 'Twitch') {
            return usr.twitchId === null ? false : true;
        }
        else {
            return usr.mixerId === null ? false : true;
        }
    }

    const render = () => {
        if(shouldShowProfile()) {
            return (
                <div style = {{width: '250px', display: 'inline-flex', padding: '8px', alignItems: 'center'}}>
                    <div style = {{position: 'relative', display: 'block', padding: '16px'}}>
                        <Avatar src = {userProfile.avatarUrl}></Avatar>
                    </div>
                    <div>
                        <Typography>{userProfile.username}</Typography>
                        <Typography>{name}</Typography>
                        <Typography style = {{cursor: 'pointer'}} variant = 'button' onClick = {() => user.logout(name.toLowerCase())}>Logout</Typography>
                    </div>
                </div>
            )
        }
        else {
            return (
                <a className = "btn login-btn"
                    href = {href}
                    title = {name}
                    style={{ backgroundColor: color, margin: 5, display: "inline-flex"}}>
                    <span>{text}</span>
                </a>
                )
        }
    }

    return (
        render()
    )
}


export default LoginButton;