
import React, {Component}from 'react';
import ReactQuill from 'react-quill'
import './quill.snow.css'; 
import {ControlLabel,FormControl, FormGroup, Button, Glyphicon} from "react-bootstrap";
import Infopopover from '../Infopopover';



//import Modal from '../Modal';

class EditDisplay extends Component{
    constructor(props){
        super(props);
        this.state = {
            showModal: false,
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleHide = this.handleHide.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateCode = this.updateCode.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleChange = (value) => {this.setState({ value, })};
    updateCode = (newCode) => {this.setState({code: newCode});}

    handleShow() {
        this.setState({showModal: true});
      }
      
    handleHide() {
        this.setState({showModal: false});
    }


    trashOnClickFunc = async function (){
        let note = Object.assign({}, this.props.currentNote);
        note.trash = 1;
        this.props.currentNoteChangeFunc(note, "move-trash");
    }.bind(this);

    collectOnClickFunc = async function (){
        let note = Object.assign({}, this.props.currentNote);
        note.collect = !note.collect;
        this.props.currentNoteChangeFunc(note, "collect-update");
    }.bind(this);

    transTime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        return Y + M + D;
    }

    handleKeyDown(event) {
        if (event.keyCode === 9) { // tab was pressed
            event.preventDefault();
            const val = this.props.currentNote.hint;
            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;
            const hint =  val.substring(0, start) + '\t' + val.substring(end);
            let currentNote = this.props.currentNote;
            currentNote.hint = hint;
            this.props.currentNoteChangeFunc(currentNote, "edit-update",);                       
        }
   }

    render(){        

        // const modal = this.state.showModal ? (
        //     <Modal>
        //       <div className="modal">
        //         <Infopopover currentNote={this.props.currentNote} closeInfoFunction={this.handleHide} />
        //       </div>
        //     </Modal>
        //   ) : null;
      

        if(this.props.currentNote === null) return(<div className="edit-display" /> );//"<p style=\"white-space: pre-wrap;\">"
        //const reAnswer = this.props.currentNote.answer.replace(/<p>/g,"<p style=\"white-space: pre-wrap;\">");
        //console.log("editdisplay", reAnswer);
        return(
            <div className='edit-display'>
                <br/>
                <div className="edit-optionBar">
                        <Button  onClick={this.collectOnClickFunc}> <Glyphicon glyph={!this.props.currentNote.collect ? "star-empty" : "star"}/></Button>
                        <Infopopover currentNote={this.props.currentNote}  parent="edit" currentNoteChangeFunc={this.props.currentNoteChangeFunc}/>
                        <Button onClick={this.trashOnClickFunc}><Glyphicon glyph="trash"/></Button>
                </div>
                <br/>
                <p style={{whiteSpace:"pre"}}>{"  Created: " + this.transTime(this.props.currentNote.created) + "        " + "Next Review Time: " + this.transTime(this.props.currentNote.spaced)}</p>
                <hr style={{width:"100%", size:7}}/>
                <FormGroup controlId='formControlsTitle' style={{padding:"8px"}}>
                    <ControlLabel style={{color: '#333'}}> Title </ControlLabel>
                    <FormControl type="text" value={this.props.currentNote.title} placeholder="Enter title" onChange={(e) => {
                        let currentNote = this.props.currentNote;
                        currentNote.title = e.target.value;
                        this.props.currentNoteChangeFunc(currentNote, "edit-update"); 
                    }}/>
                </FormGroup>
                <FormGroup controlId='formControlsHint' style={{padding:"8px"}}>
                    <ControlLabel style={{color: '#333'}}> Hint </ControlLabel>
                    <FormControl ref="input" style={{height:"140px"}} componentClass="textarea" value={this.props.currentNote.hint} placeholder="Enter hint" onChange={(e) => {
                        let currentNote = this.props.currentNote;
                        currentNote.hint = e.target.value;
                        this.props.currentNoteChangeFunc(currentNote, "edit-update"); 
                    }}  onKeyDown={this.handleKeyDown}/>
                </FormGroup>
                <ControlLabel style={{color: '#333', paddingLeft:"8px", paddingRight:"8px"}}> Answer </ControlLabel>
                <ReactQuill theme={"snow"} className="edit-quill" ref="quill"
                            value={this.props.currentNote.answer}  modules={EditDisplay.modules} formats={EditDisplay.formats}
                            onChange={(value) => {
                                let currentNote = this.props.currentNote;
                                currentNote.answer = value;
                                this.props.currentNoteChangeFunc(currentNote, "edit-update"); 
                            }} /> 
                 {/* <div className='markdown-display'>
                <div className="hint">The editor is below, with default options. This example also uses marked to generate the preview on the right as you type.</div>
                    <Editor value={this.state.code} onChange={this.updateCode}/>
                    <div className="preview" dangerouslySetInnerHTML={{__html: preview}} />
                </div> */}
                
            </div>
        );
    }

}

EditDisplay.modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  }

  EditDisplay.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]

export default EditDisplay;