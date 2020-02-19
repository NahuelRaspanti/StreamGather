import React from "react";
import { data } from "../data"
import LoginButton from "./LoginButton"

const Buttons = (user) => {
    return data.map(app => {
        return (
            <LoginButton app={app} key={app.name} user = {user.user}/>
        );
});
} 

const ButtonList = (user) => {
    return (
        <div style = {{ textAlign: 'center', display: 'inline-flex'}}>
            <Buttons user = {user.user}></Buttons>
        </div>
    )
};

export default ButtonList;