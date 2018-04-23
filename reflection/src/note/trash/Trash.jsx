
import React, {Component} from 'react';
import NoteList from "../NoteList";
//import {Modal, Button} from "react-bootstrap";
import TrashDisplay from "./TrashDisplay";
import './trash.css';

const ep= require('react-eventproxy');

class Trash extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentNote: null,
        };
        this.noteOnClickFunc = this.noteOnClickFunc.bind(this);
        this.currentNoteChangeFunc = this.currentNoteChangeFunc.bind(this);
    }

    noteOnClickFunc = (note) => {
        this.setState({
            currentNote: note,
        });
    }

    currentNoteChangeFunc = (currentNote, option) => { 
        this.setState({
            currentNote,
        });
        setTimeout(() => {
            ep.default.trigger('all-update', currentNote, option);
        },50);
    }


    componentWillReceiveProps(nextProps){
        if(this.state.currentNote === null) return;
        this.setState({
            currentNote:nextProps.notes[this.state.currentNote.created] || null,
        });
    }

    render(){
        return(
            <div className={this.props.content}>
                <div className='control-bar'>
                    <NoteList
                        notes={ this.props.notes}
                        noteOnClickFunc={this.noteOnClickFunc}
                        currentNote={this.state.currentNote}
                        tag="TrashNotes"
                    />      
                </div>
                <TrashDisplay currentNote={this.state.currentNote} currentNoteChangeFunc={this.currentNoteChangeFunc}/>
            </div>
        );
    }

}

export default Trash;