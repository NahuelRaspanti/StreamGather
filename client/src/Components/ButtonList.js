import React from "react";
import { data } from "../data"
import LoginButton from "./LoginButton"

const Buttons = (user, logout) => {
    return data.map(app => {
        return (
            <LoginButton app={app} key={app.name} user = {user} logout = {logout}/>
        );
});
} 

const ButtonList = ({user, logout}) => {
    return (
            <Buttons user = {user} logout = {logout}></Buttons>
    )
};

export default ButtonList;