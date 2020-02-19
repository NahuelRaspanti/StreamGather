import React from 'react';

const LoginButton = ({app}) => {
    const {name, href, text, color} = app;
    
    return (
        <div style= {{width: '25%'}}>
        <a className = "btn login-btn"
            href = {href}
            title = {name}
            style={{ backgroundColor: color, margin: 5, display: "block" }}
        >
            <span>{text}</span>
        </a>
        <a className = "btn">
            Logout
        </a>
        </div>
    )
}


export default LoginButton;