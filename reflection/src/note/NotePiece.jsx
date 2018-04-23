import React from "react"
import {Button} from "react-bootstrap"

const NotePiece = ({noteOnClickFunc, currentNote, note}) => {

    const onClickFunc = () => {
        noteOnClickFunc(note);
    }

// console.log("Note piece", Object.is(Object.assign({},note), note));
    return(
        <Button onClick={onClickFunc} bsStyle={Object.is(currentNote, note)? "primary" : "default"}>
            {note.title.length > 10 ? (note.title.slice(0,7) + "...") : note.title}
        </Button>
    );
}

export default NotePiece;