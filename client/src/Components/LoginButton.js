import React from 'react';
import { Avatar, Typography, Badge } from '@material-ui/core';
import _ from 'lodash'
import {ReactComponent as TwitchSVG} from '../Images/twitchsvg.svg'
import {ReactComponent as MixerSVG} from '../Images/mixersvg.svg'
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    logout: {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
  })); 

const LoginButton = ({app, user}) => {
    const {name, href, text, color} = app;
    const userProfile = name === "Twitch" ? user.user[1] : user.user[2];
    const classes = useStyles();

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

    const providerIcon = () => {
        if(name === 'Twitch') {
            return <TwitchSVG style = {{width: '20px', heigth: '20px', backgroundSize: '20px 20px'}} alt = "Twitch"></TwitchSVG>
        }
        return <MixerSVG style = {{width: '20px', heigth: '20px', backgroundSize: '20px 20px'}} alt = "Mixer"></MixerSVG>
    }

    const render = () => {
        if(shouldShowProfile()) {
            return (
                <div style = {{width: '250px', display: 'inline-flex', padding: '8px', alignItems: 'center'}}>
                    <div style = {{position: 'relative', display: 'block', padding: '16px'}}>
                        <Badge
                        overlap = "circle"
                        anchorOrigin = {{
                            vertical: "bottom",
                            horizontal: "right"
                        }}
                        badgeContent = {providerIcon()}
                        
                        >
                        <Avatar src = {userProfile.avatarUrl}></Avatar>
                        </Badge>
                    </div>
                    <div>
                        <Typography>{userProfile.username}</Typography>
                        <Typography className = {classes.logout} variant = 'button' onClick = {() => user.logout(name.toLowerCase())}>Logout</Typography>
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