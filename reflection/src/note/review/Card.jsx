import React, { Component } from 'react';
import ReactDOM from "react-dom";
import {TweenLite, Back} from "gsap";
import './Card.css';
import {Button, Glyphicon, ButtonGroup, ControlLabel, FormControl, FormGroup} from "react-bootstrap";
import Infopopover from '../Infopopover';
import ReactQuill from 'react-quill';

const ep= require('react-eventproxy');

class Card extends Component {
    

    componentDidUpdate(){
        if(this.props.currentNote === null) return;
        const front = ReactDOM.findDOMNode(this.refs.front);
        const back = ReactDOM.findDOMNode(this.refs.back);
        const card = ReactDOM.findDOMNode(this.refs.cardwrap);
        TweenLite.set(card,{
            perspective: -234,
            transformStyle:'preserve-3d'});
        TweenLite.set(card,{rotationY:0});
        TweenLite.set(back,{rotationY:-180});
        TweenLite.set([back,front],{backfaceVisibility:'hidden'});
    }

    // shouldComponentUpdate(nextProps){
    //     return !Object.is(nextProps.currentNote,this.props.currentNote);
    // }

    questionOnClickFunc = (e) => {
        const card = ReactDOM.findDOMNode(this.refs.cardwrap);
        TweenLite.to(card, 1, {rotationY:180, ease:Back.easeOut});
    }

    answerOnClickFunc = (e) => {
        const card = ReactDOM.findDOMNode(this.refs.cardwrap);
        TweenLite.to(card, 1, {rotationY:0, ease:Back.easeOut});
    }

    collectOnClickFunc = () => {
        let currentNote = this.props.currentNote;
        currentNote.collect = !currentNote.collect;
        this.props.currentNoteChangeFunc(currentNote, "collect-update");
    }

    currentNoteEditFunction =  async function (){
        this.props.contentChangeFunc("edit");
        await setTimeout(() => {
            ep.default.trigger('currentnote-change', this.props.currentNote);
        },50);
    }.bind(this);

    render() {
        if(this.props.currentNote === null) return(<div className="Card"/> );
        const reAnswer = this.props.currentNote.answer.replace(/<p>/g,"<p style=\"white-space: pre;\">");
        return (
            <div className="Card">
                <div className="card-optionBar">
                    <ButtonGroup>
                        <Button  onClick={this.collectOnClickFunc} > <Glyphicon glyph={!this.props.currentNote.collect ? "star-empty" : "star"}/></Button>
                        <Button onClick={ this.props.completeFunc}> <Glyphicon glyph={this.props.currentNote.complete ? "remove-sign" : "ok-sign"}/></Button>
                        <Button onClick={this.currentNoteEditFunction}><Glyphicon glyph="edit"/></Button>
                        <Infopopover currentNote={this.props.currentNote}  parent="review" currentNoteChangeFunc={this.props.currentNoteChangeFunc}/>
                    </ButtonGroup>
                </div>
                <div className="wrap-container">
                    <div className="cardWrap" ref="cardwrap" > 
                        <div className="question-face" onClick={this.questionOnClickFunc} ref="front">
                            <FormGroup controlId='formControlsTitleCard' className="card-formcontrolstitle">
                                <ControlLabel style={{color: '#333'}}> Title </ControlLabel>
                                <FormControl type="text" value={this.props.currentNote.title} placeholder="Enter title" readOnly={true}/>
                            </FormGroup>
                            <FormGroup controlId='formControlsHintCard' className="card-formcontrolshint">
                                <ControlLabel style={{color: '#333'}}> Hint </ControlLabel>
                                <FormControl style={{height:"100%"}} componentClass="textarea" value={this.props.currentNote.hint} placeholder="Enter hint" readOnly={true}/>
                            </FormGroup>
                        </div>
                        <div className="answer-face"  onClick={this.answerOnClickFunc} ref="back">
                            <ControlLabel style={{color: '#333', paddingTop:"8px"}}> Answer </ControlLabel>
                            <ReactQuill theme={null} className="review-quill"
                            defaultValue={reAnswer} readOnly={true}/>
                        </div>
                    </div>
                </div>
                <div className='page-control'>
                        <Button className="pre-button" onClick = {() => {this.props.nextOrPreFunc("pre")}}> <Glyphicon glyph="chevron-left"/> </Button>
                        <Button className="next-button" onClick = {() => {this.props.nextOrPreFunc("next")}}><Glyphicon glyph="chevron-right"/>  </Button>
                </div>
            </div>
        );

    }
}

export default Card;