// import React from "react";
// import {OverlayTrigger, Button, Popover, ButtonToolbar, Overlay} from "react-bootstrap";

import React from "react";
import { Button, Form, FormGroup, Col, FormControl, ControlLabel , Popover, OverlayTrigger, Glyphicon} from "react-bootstrap";
import DatePicker from 'react-datepicker';
import moment from "moment";
import '../react-datepicker.css';



// const modalRoot = document.getElementById('modal-root');
//const  reUrl =  /^((ht|f)tps?):\\([\w-]+(.[\w-]+)*\?)+(\?([\w\-.,@?^=%&:/~+#]*)+)?$/;

class Infopopover extends React.Component{
    constructor(props){
        super(props);
    }

    componentWillReceiveProps(nextProps){
    }

    componentWillUnmount(){
    }

    transTime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        return Y + M + D;
    }

    // cancelFunction = (e) => {
    //     this.props.closeInfoFunctionn();
    // }


    render(){
        // console.log("Infopopover",this.props.currentNote.spaced);
        const popoverClickRootClose = (
            <Popover id="popover-trigger-click-root-close" title="Information" >
                <Form horizontal>
                    <FormGroup controlId="formHorizontalTitle">
                        <Col componentClass={ControlLabel} sm={4}>
                            Title
                        </Col>
                        <Col sm={8}>
                            <FormControl type="text" placeholder="Enter Title" value={this.props.currentNote.title} readOnly={this.props.parent === "trash" ? true : false} onChange={this.props.parent === "trash" ? ()=>{} :
                                (e) => {
                               let currentNote = this.props.currentNote;
                               currentNote.title = e.target.value;
                               this.props.currentNoteChangeFunc(currentNote, "info-update");
                                }}/>
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalCreatedTime">
                        <Col componentClass={ControlLabel} sm={4}>
                            Created
                        </Col>
                        <Col sm={8}>
                            <FormControl type="text" placeholder="Enter Created Time" value={this.transTime(this.props.currentNote.created)} readOnly={true}/>
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalSpaced">
                        <Col componentClass={ControlLabel} sm={4}>
                            Next Time
                        </Col>
                        <Col sm={8}>
                        <DatePicker className="spaced" selected={moment(this.props.currentNote.spaced)} todayButton={"today"} placeholderText="Click to select a date"  disabled={this.props.parent === "trash" ? true : false}   minDate={moment()} onChange={(e) => {
                                let currentNote = this.props.currentNote;
                                currentNote.spaced = e;
                                this.props.currentNoteChangeFunc(currentNote, "info-update");
                                }}/>
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalReviews">
                        <Col componentClass={ControlLabel} sm={4}>
                            To Reviews
                        </Col>
                        <Col sm={8}>
                            <FormControl type="text" placeholder="Enter Review Times" value={this.props.currentNote.toReview} readOnly={this.props.parent === "trash" ? true : false} onChange={(e) => {
                                let currentNote = this.props.currentNote;
                                currentNote.toReview = e.target.value;
                                this.props.currentNoteChangeFunc(currentNote, "info-update");
                                }}/>
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalURL">
                        <Col componentClass={ControlLabel} sm={4}>
                            URL
                        </Col>
                        <Col sm={8}>
                            <FormControl type="text" placeholder="Enter URL" value={this.props.currentNote.url} readOnly={this.props.parent === "trash" ? true : false} onChange={(e) => {
                                let currentNote = this.props.currentNote;
                                if(e.target.value){
                                    currentNote.url = e.target.value;
                                    this.props.currentNoteChangeFunc(currentNote, "info-update");
                                }
                            }}/>
                        </Col>
                    </FormGroup>
                </Form>
            </Popover>
          );

        return(
                <OverlayTrigger className="info-popover" trigger="click" rootClose placement="bottom" overlay={popoverClickRootClose}>
                <Button className="info-btn"><Glyphicon glyph="info-sign"/></Button>
                </OverlayTrigger>
        );
    }
}

export default Infopopover;

                // <ButtonGroup>
                //         <Button onClick={this.saveFunction}>Save</Button>
                //         <Button onClick={this.cancelFunction}>Cancel</Button>
                //     </ButtonGroup>

// const Infopopover = ({currentNote}) => {

//     const ep= require('react-eventproxy');


//     const collectOnClickFunc = async function (){
//         await setTimeout(() => {
//             ep.default.trigger('collect-change', currentNote);
//         },500);
//     }

//     const CuttentNoteEditFunction =  async function (){
//         await setTimeout(() => {
//             ep.default.trigger('content-change', "edit");
//         },500);
//         await setTimeout(() => {
//             ep.default.trigger('currentnote-change', currentNote);
//         },500);
//     }

//     const popoverClickRootClose = (
//         <Popover id="popover-trigger-click-root-close" title="NoteInfo">
//             djafkljfa;sd
//         </Popover>
//     );

//     return(
//       <ButtonToolbar>
//       <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popoverClickRootClose}>
//       <Button>点击外部背景取消</Button>
//     </OverlayTrigger>
//     </ButtonToolbar>
//     );
// }

// export default Infopopover;