import React from 'react';
import { Avatar, Typography } from '@material-ui/core';

const LoginButton = ({app, user}) => {
    const {name, href, text, color} = app;
    const userProfile = name === "Twitch" ? user[1] : user[2];

    const render = () => {
        if(userProfile) {
            return (
                <a className = "btn">
                    <div>
                        <Avatar src = {userProfile.avatarUrl}></Avatar>
                    </div>
                    {userProfile.username}
                    Logout
                </a>
            )
        }
        else {
            return (
                <a className = "btn login-btn"
                    href = {href}
                    title = {name}
                    style={{ backgroundColor: color, margin: 5, display: "block" }}>
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