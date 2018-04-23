import React from "react";
import {Button} from "react-bootstrap";

const MainButton = ({content, text, contentChangeFunc}) => {

    const onClickFunc = () => {
        contentChangeFunc(text);
    }


    return(
        <Button onClick={onClickFunc} bsStyle={content === text ? "primary" : "default"}> {text.toUpperCase()} </Button>
    );
}

export default MainButton;