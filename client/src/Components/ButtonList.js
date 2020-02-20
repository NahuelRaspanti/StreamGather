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
            <Buttons user = {user.user}></Buttons>
    )
};

export default ButtonList;