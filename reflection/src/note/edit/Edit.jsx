
import React, {Component} from 'react';
import NoteList from "../NoteList";
import EditDisplay from "./EditDisplay";
import "./edit.css"
import {Button, Table} from "react-bootstrap";

const ep= require('react-eventproxy');

class Edit extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentNote: null,
        };
        this.currentNoteChangeFunc = this.currentNoteChangeFunc.bind(this);
        this.generateBody = this.generateBody.bind(this);
        this.noteOnClickFunc = this.noteOnClickFunc.bind(this);
    }

    noteOnClickFunc = (note) => {
        console.log("note on click");
        this.setState({
            currentNote: note,
        });
    }

    currentNoteChangeFunc = (currentNote, option,) => {
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

    componentDidMount(){
        const ep = require('react-eventproxy');
        ep.default.on("currentnote-change", (currentNote) => {
            console.log("edit part currentnote-change get",currentNote);
            this.setState({
              currentNote,
            });
        });
    }
    
    

    generateBody = () => { //当数据量大的时候需要优化 现在时刻在重新生成
        let body = [];
        for(let id in this.props.notes){
            const note = this.props.notes[id];
            const date = new Date(note.created);
            const Y = date.getFullYear() + '-';
            const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
            body.push(<tr key={note.created}>
                        <td>{Y+M+D}</td>
                        <td><Button onClick={()=>{this.setState({currentNote:note})}} bsStyle={Object.is(note,this.state.currentNote) ? "primary" : "default"} block>{note.title.length > 10 ? (note.title.slice(0,7) + "...") : note.title}</Button></td>
                 </tr>);
        }
        return body;
    }

    render(){
        return(
            <div className="edit" ref="edit" >
                <div className='control-bar'>
                    <NoteList
                        notes={this.props.collectNotes}
                        noteOnClickFunc={this.noteOnClickFunc}
                        currentNote={this.state.currentNote}
                        tag="CollectNotes"
                    />
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th>Created</th>
                                <th>Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.generateBody()}
                        </tbody>
                    </Table>         
                </div>
                <EditDisplay
                    currentNote={this.state.currentNote}
                    currentNoteChangeFunc={this.currentNoteChangeFunc}/>
            </div>
        );
    }

}

export default Edit;