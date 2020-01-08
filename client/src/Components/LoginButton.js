import React from 'react';

const LoginButton = ({app}) => {
    const {name, href, text, color} = app;

    const style = {
        margin: 5,
        display: "block"
    };

    return (
        <a className = "btn login-btn"
            href = {href}
            title = {name}
            style={{ backgroundColor: color, margin: 5, display: "block" }}
        >
            <span>{text}</span>
        </a>
    )
}


export default LoginButton;