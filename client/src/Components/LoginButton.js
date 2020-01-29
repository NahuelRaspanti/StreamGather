import React from 'react';

const LoginButton = ({app}) => {
    const {name, href, text, color} = app;
    
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