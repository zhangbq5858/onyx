import React, {Component} from 'react';
import Card from './Card';
import './review.css';
import NoteList from "../NoteList";
import {ProgressBar} from "react-bootstrap";
import moment from "moment"

const ep= require('react-eventproxy');
const shiftDays = [30, 7, 2, 1];

class Review extends Component{
    constructor(props){
        super(props);
        const completedNotes = [];
        const uncompletedNotes = [];
        for(let created in this.props.notes){
            let note = this.props.notes[created];
            if(note.complete){
                completedNotes.push(note);
            }else{
                uncompletedNotes.push(note);
            }
        }
        //console.log("review constructor", completedNotes,uncompletedNotes); 
        this.state = {
            currentNote: null,
            completedNotes,
            uncompletedNotes,
        };
        this.noteOnClickFunc = this.noteOnClickFunc.bind(this);
        this.completeFunc = this.completeFunc.bind(this);
        this.nextOrPreFunc = this.nextOrPreFunc.bind(this);
        this.currentNoteChangeFunc = this.currentNoteChangeFunc.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const completedNotes = [];
        const uncompletedNotes = [];
        for(let created in nextProps.notes){
            let note = nextProps.notes[created];
            if(note.complete){
                completedNotes.push(note);
            }else{
                uncompletedNotes.push(note);
            }
        }
        //console.log("review will receive", completedNotes, uncompletedNotes);        
        this.setState({
            completedNotes,
            uncompletedNotes,
        });
        if(this.state.currentNote !== null){
            this.setState({
                currentNote:nextProps.notes[this.state.currentNote.created] || null,
            });
        }
    }

    currentNoteChangeFunc = (currentNote, option) => { 
        this.setState({
            currentNote,
        });
        setTimeout(() => {
            ep.default.trigger('all-update', currentNote, option);
        },50);
    }

    //中间部分展示列表 点击切换当前currentNote用
    noteOnClickFunc = (note) => {
        //console.log("review note list piece click", note);
        this.setState({
            currentNote: note,
        });
    }

    completeFunc = () => { // 完成以及未完成状态的切换  todo 更改review time 以及广播给root 端
        const currentNote = this.state.currentNote;
        const containNotes = currentNote.complete ? [...this.state.completedNotes] : [...this.state.uncompletedNotes];
        const transferNotes = !currentNote.complete ? [...this.state.completedNotes] : [...this.state.uncompletedNotes];
        const index = containNotes.indexOf(currentNote);

        currentNote.complete = !currentNote.complete;
        if(currentNote.complete){
            currentNote.toReview -= 1;
            if(currentNote.toReview > 0){
                let spaced = moment().add(shiftDays[currentNote.toReview] || 1, 'day');
                currentNote.spaced = spaced;
                //console.log("完成复习 spaced", currentNote.spaced);
            }
        }
        else{
            currentNote.toReview += 1;
            currentNote.spaced = moment();
            //console.log("失去复习 spaced", currentNote.spaced); 
        }
        containNotes.splice(index,1);      
        transferNotes.push(currentNote);

        //更新app root的总数据
        this.currentNoteChangeFunc(currentNote, "reviewTime-update");
        
        //更新review root的数据
        this.setState({
            uncompletedNotes: currentNote.complete ? containNotes : transferNotes,
            completedNotes: !currentNote.complete ? containNotes : transferNotes,
            currentNote: containNotes[index - 1] || containNotes[index] || null, 
        });
    }

    nextOrPreFunc = (option) => {
        const notes = this.state.currentNote.complete ? this.state.completedNotes : this.state.uncompletedNotes;
        const id = notes.indexOf(this.state.currentNote);
        this.setState({
            currentNote: option === "next" ? notes[id + 1] || notes[id] : notes[id - 1] || notes[id],
        });
    }


    render(){
       const now = Object.keys(this.props.notes).length === 0 ? 100 : (this.state.completedNotes.length / Object.keys(this.props.notes).length * 100).toFixed(0);  
        return(
            <div className="review">
                <div className='control-bar'>
                    <NoteList
                        notes={this.state.completedNotes}
                        noteOnClickFunc={this.noteOnClickFunc}
                        currentNote={this.state.currentNote}
                        tag={"Complete"}
                    />  
                    <NoteList
                        notes={this.state.uncompletedNotes}
                        noteOnClickFunc={this.noteOnClickFunc}
                        currentNote={this.state.currentNote}
                        tag={"Uncomplete"}
                    />                       
                    <ProgressBar now={parseInt(now)} label={`${now}%`}  striped bsStyle="success" active/>
                </div>
                <Card 
                    currentNote = {this.state.currentNote}
                    completeFunc = {this.completeFunc}
                    currentNoteChangeFunc = {this.currentNoteChangeFunc}
                    nextOrPreFunc = {this.nextOrPreFunc}
                    contentChangeFunc={this.props.contentChangeFunc}
                />
            </div>
        );
    }

}

export default Review;