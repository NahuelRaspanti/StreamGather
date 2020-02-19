import React from 'react';

const LoginButton = ({app, user}) => {
    const {name, href, text, color} = app;
    const userProfile = name === "Twitch" ? user[1] : user[2];

    const render = () => {
        if(userProfile) {
            return (
                <a className = "btn">
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