import React from "react";
import { data } from "../data"
import LoginButton from "./LoginButton"

const ButtonList = () => {
    return data.map(app => {
            return <LoginButton app={app} key={app.name} />;
    });
};

export default ButtonList;