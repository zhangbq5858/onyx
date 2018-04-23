
import React, {Component} from 'react';
import {Button, ButtonToolbar, Modal, FormControl, FormGroup, ControlLabel} from "react-bootstrap";
import ReactQuill from 'react-quill';
import Infopopover from '../Infopopover';
import moment from "moment";

class TrashDisplay extends Component{
    constructor(props){
        super(props);
        this.state = {
            showDeleteModal:false,
            showRestoreModal:false,
        }
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.closeRestoreModal = this.closeRestoreModal.bind(this);
        this.openRestoreModal = this.openRestoreModal.bind(this);
        this.DeleteFunction = this.DeleteFunction.bind(this);
        this.RestoreFunction = this.RestoreFunction.bind(this);
    }

    closeDeleteModal = () => {this.setState({showDeleteModal:false})};
    closeRestoreModal = () => {this.setState({showRestoreModal:false})};
    openDeleteModal = () => {this.setState({showDeleteModal:true})};
    openRestoreModal = () => {this.setState({showRestoreModal:true})};

    DeleteFunction = async function(){
        let currentNote = this.props.currentNote;
        currentNote.trash = 2;
        this.closeDeleteModal();
        this.props.currentNoteChangeFunc(currentNote, "trash-delete");
    }

    RestoreFunction = () => {
        let currentNote = this.props.currentNote;
        currentNote.trash = 0;
        this.closeRestoreModal();
        this.props.currentNoteChangeFunc(currentNote, "trash-restore");
    }

    render(){
        if(this.props.currentNote === null) return(<div className="trash-display" /> );

        const modules = {
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline','strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image'],
              ['clean']
            ],
          };
        
        const  formats = [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
          ];

          const reAnswer = this.props.currentNote.answer.replace(/<p>/g,"<p style=\"white-space: pre;\">");
        return(
            <div className='trash-display'>
                <br/>
                <h4 style={{whiteSpace:"pre", width:"300px"}}>{"  Created: " + moment(this.props.currentNote.createTime).format("LL") + "        " + "Next Review Time: " + moment(this.props.currentNote.nextReviewTime).format("LL")} 
                   <div style={{display:"inline-block",position:"absolute", width:"65%", left:"300px"}}>
                        <div style={{textAlign:"right"}}>
                            <Infopopover currentNote={this.props.currentNote} parent="trash" currentNoteChangeFunc={this.props.currentNoteChangeFunc}/>
                        </div>
                    </div>                    
                </h4>
                <h4 style={{whiteSpace:"pre"}}>{"  This note is deleted. You cannot edit it unless you restore it."}</h4>
                <br/>                
                <ButtonToolbar >
                    <Button bsSize="large" onClick={this.openDeleteModal}>Delete Forever</Button>
                    <Button bsSize="large" onClick={this.openRestoreModal}>Restore Note</Button>
                </ButtonToolbar>
                <hr style={{width:"100%", size:7}}/>

                <FormGroup controlId='formControlsTitle' style={{padding:"8px"}}>
                    <ControlLabel style={{color: '#333'}}> Title </ControlLabel>
                    <FormControl type="text" value={this.props.currentNote.title} placeholder="Enter title" readOnly="readonly"/>
                </FormGroup>

                <FormGroup controlId='formControlsHint' style={{padding:"8px"}}>
                    <ControlLabel style={{color: '#333'}}> Hint </ControlLabel>
                    <FormControl style={{height:"140px"}} componentClass="textarea" value={this.props.currentNote.hint} placeholder="Enter hint" readOnly="readonly"/>
                </FormGroup>

                <ControlLabel style={{color: '#333', paddingLeft:"8px", paddingRight:"8px"}}> Answer </ControlLabel>
                <ReactQuill theme="snow" className="trash-quill"
                value={reAnswer}  modules={modules} formats={formats} readOnly={true}/>


                <Modal show={this.state.showDeleteModal} onHide={this.closeDeleteModal}>
                    <Modal.Header closeButton/>
                    <Modal.Body>
                        <h4> Permanently delete this note ? </h4>
                        <p> This can't be undone.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeDeleteModal}>Cancel</Button><Button onClick={this.DeleteFunction}>Delete Note Forever</Button> 
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showRestoreModal} onHide={this.closeRestoreModal}>
                    <Modal.Header closeButton/>
                    <Modal.Body>
                        <h4> This note will return to its original place. </h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeRestoreModal}>Cancel</Button><Button onClick={this.RestoreFunction}>Restore Note</Button> 
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}

export default TrashDisplay;