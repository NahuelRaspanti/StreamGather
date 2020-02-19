import React from "react";
import { data } from "../data"
import LoginButton from "./LoginButton"

const ButtonList = (user) => {
    return data.map(app => {
            return <LoginButton app={app} key={app.name} user = {user.user}/>;
    });
};

export default ButtonList;