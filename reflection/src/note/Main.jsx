import React, { Component } from 'react';
import Review from './review/review'
import Edit from './edit/Edit'
import MainButton from "./MainButton"
import {ButtonGroup,Button, Glyphicon} from "react-bootstrap";
import Trash from "./trash/Trash";
import { Link } from 'react-router-dom';
import moment from 'moment';

const ep= require('react-eventproxy');

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
        content: "edit", // "edit","trash","review"
        trashNotes:{},
        collectNotes:{},
        editNotes:{},
        reviewNotes:{},
    };
    this.generateMainContent = this.generateMainContent.bind(this);
    this.contentChangeFunc = this.contentChangeFunc.bind(this);
    this.updateNotes = this.updateNotes.bind(this);
    this.addClickFunc = this.addClickFunc.bind(this);
    this.changeComplete = this.changeComplete.bind(this);
  }


  componentWillMount() {
      this.updateNotes(this.props.allNotes);
  }

  componentWillReceiveProps(nextProps){
    // console.log("main receive props",nextProps.allNotes);
     if(Object.keys(this.props.allNotes).length === 0){
       let reviewNotes = {}; // 当登录以后 第一次加载时 自动生成需要复习的note，并添加complete属性， 在更新到数据库时回自动删除掉该comlete属性，并且除非刷新登录，待复习note数量不会改变（只有完不完成的状态改变）         
       for(let created in nextProps.allNotes){
         const note = nextProps.allNotes[created]; 
         //console.log("main receive props", note, moment(note.spaced), moment().isBefore(moment(note.spaced)));
         if(note.trash === 0 && ! moment().isBefore(moment(note.spaced).format("LL")) && note.toReview > 0){ // 未在垃圾箱中复习时间小于等于今天，以及还有需复习次数的时候 才被认定为需要复习对象。
           //console.log("main review note", note.title, today,new Date(note.spaced),today.getTime(), new Date(note.created).getTime(),today.getTime() >= new Date(note.created).getTime());
           note.complete = false;
           reviewNotes[note.created] = note;
         }
       }
       this.updateNotes(nextProps.allNotes, reviewNotes);
     }
     else{
       this.updateNotes(nextProps.allNotes);
     }
   }

  shouldComponentUpdate(nextProps, nextState){ //save unnecessary render cost
    //console.log("main should update",nextProps.modifyContent);
      if(nextState.content !== this.state.content){
          return true;
      }
      //console.log("main will update with -------", nextProps.modifyContent);  
      if(nextProps.modifyContent === "" || nextProps.modifyContent === "addNote" || nextProps.modifyContent === "trash-delete" || nextProps.modifyContent === "trash-restore" 
      || nextProps.modifyContent === "move-trash" || nextProps.modifyContent === "collect-update" || nextProps.modifyContent === "get-allNotes"){
      //  console.log("main will update with ------- success");  
        return true;
      }
    //  console.log("main will update with ------- false");
      return false;
  }

  updateNotes = (allNotes, preReviewNotes = this.state.reviewNotes) => {
    let trashNotes = {};
    let collectNotes = {};
    let editNotes = {};
    let reviewNotes = {};

    

    for(let created in allNotes){
        const note = allNotes[created]; 
        //reviewNotes 更新
       //console.log("main updateNotes",preReviewNotes[created],note);
        
        if(preReviewNotes[created]){
          //console.log("reviewnotes update in main", note);
          reviewNotes[created] = note;
        }      
        // colectNotes 更新
        if(note.collect === true){
            collectNotes[note.created] = note;
        }
        // trashNotes 更新
        if(note.trash === 1){ // 垃圾箱里的
            trashNotes[note.created] = note;
        }
        // editNotes 更新
       // console.log("main updateNotes",this.state.reviewNotes[created],note);       

        if(note.trash === 0){ // 未在垃圾箱中的
            editNotes[note.created] = note;  
        }
    }
    //console.log("update notes in main.jsx",)
    this.setState({
        trashNotes,
        collectNotes,
        editNotes,
        reviewNotes,
    })
  }

  changeComplete = (note) => {
    let reviewNotes = Object.assign({},this.state.reviewNotes);
    reviewNotes[note.created] = note;
    this.setState({
      reviewNotes,
    });
  }

  generateMainContent = () => {
    if(this.state.content === null) return;
    else if(this.state.content === "review"){
      return ( <Review notes={this.state.reviewNotes} contentChangeFunc={this.contentChangeFunc} changeComplete={this.changeComplete}/>);
    }   
    else if(this.state.content === "edit"){
      return ( <Edit notes={this.state.editNotes} collectNotes={this.state.collectNotes}/>);
    }
    else if(this.state.content === "trash"){
      return ( <Trash notes={this.state.trashNotes}/>);
    }
  }

  contentChangeFunc = (text) => {
    this.setState({content: text});
  }

  addClickFunc = async function(){
      //发送添加广播
      await setTimeout(() => {
          ep.default.trigger('all-add');
      },500);

      //聚焦
      this.contentChangeFunc("edit");

  }

  render() {
    return (
      <div className="main">
        <div className="main-bar ">
            <ButtonGroup vertical block style={{top:"5%"}}>
              <Button bsSize="large" onClick={this.addClickFunc}><Glyphicon glyph="plus-sign" /> New Note</Button>
              <br/>
              <br/>
              <MainButton content={this.state.content} text={"review"} contentChangeFunc={this.contentChangeFunc}/>
              <MainButton content={this.state.content} text={"trash"} contentChangeFunc={this.contentChangeFunc}/>
              <MainButton content={this.state.content} text={"edit"} contentChangeFunc={this.contentChangeFunc}/>
              <br/>
              <br/>
              <Link to="./"><Button bsSize="large" block> Log Out </Button></Link> 
            </ButtonGroup>
        </div>
        <div className="page-region">
          {this.generateMainContent()}
        </div>
      </div>
    );
  }
}

export default Main;
