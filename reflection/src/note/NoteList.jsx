import React, { Component } from 'react';
import "./NoteList.css";
import NotePiece from "./NotePiece";
import {Button, ButtonGroup, Badge} from "react-bootstrap";

class NoteList extends Component{
    constructor(props){
        super(props);
        this.state = {
            fold: false,
        };
        this.generateList = this.generateList.bind(this);
        this.foldOnClickFunc = this.foldOnClickFunc.bind(this);
        this.foldSymbol= this.foldSymbol.bind(this);
    }

    generateList = () => {
        if(this.state.fold) return [];
        let lists = [];
        for(let id in this.props.notes){
            const note = this.props.notes[id];
            lists.push(
                <NotePiece key={note.created}
                    currentNote = {this.props.currentNote}
                    note = {note}
                    noteOnClickFunc = {this.props.noteOnClickFunc}
                /> 
            );
        }
        return lists;
    }

    foldOnClickFunc = (e) => {
        this.setState({
            fold: !this.state.fold,
        });
    }

    foldSymbol = (flag) => {
        return ! flag ? " - " : " + ";
    }

    foldHint = (flag) => {
        return ! flag ? "Show" : "Hide";
    }

    render(){
        const lists = this.generateList();
        return(
            <div className="NoteList">
                <Button bsSize="large" onClick={this.foldOnClickFunc} block> {this.foldSymbol(this.state.fold) + "          " + this.props.tag + "    " } <Badge>{this.props.notes.length || Object.keys(this.props.notes).length}</Badge></Button>
                <ButtonGroup bsSize="xsmall" vertical block>
                    {lists}
                </ButtonGroup>
            </div>
        );
    }
}

export default NoteList;