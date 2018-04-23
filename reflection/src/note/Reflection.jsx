import React, { Component } from 'react';
import './reflection.css';
import Main from "./Main.jsx";
import {Modal, Button} from "react-bootstrap";
import { Link } from 'react-router-dom';
import moment from "moment";
import {requestAllnotes, requestUpdate} from "../service/user";


class Reflection extends Component {


  constructor(props) {
    super(props);
    const data = this.props.location.state;
    console.log("reflection constructor", data);

    this.state = {
        owner: data ? data.owner : null,
        allNotes:{},
        updateNotes:{},
        modifyContent:"",
    };
    this.registerBroadcast = this.registerBroadcast.bind(this);
  }


  registerBroadcast = () => {
    const ep = require('react-eventproxy');  
    ep.default.on("all-add", async function (){
      console.log("all-add capture");
      const newNote = this.genernateNewNote();
      const updateNotes = Object.assign({},this.state.updateNotes);
      const allNotes = Object.assign({},this.state.allNotes);
      allNotes[newNote.created] = newNote;
      updateNotes[newNote.created] = newNote;
      await this.setState({
        allNotes,
        updateNotes,
        modifyContent: "addNote",
      });
      //协助edit 聚焦新生成note
      await setTimeout(() => {
        ep.default.trigger('currentnote-change', newNote);
      },50);
    }.bind(this));

    //更新操作有 "reviewTime-update", "trash-delete", "trash-restore", "collect-update", "info-update","move-trash","get-addNotes"
    ep.default.on("all-update", (updateNote, modifyContent) => {
      console.log("all-update capture",modifyContent);
      const updateNotes = Object.assign({},this.state.updateNotes);
      const allNotes = Object.assign({},this.state.allNotes);
      allNotes[updateNote.created] = updateNote;
      updateNotes[updateNote.created] = updateNote;
      this.setState({
        allNotes,
        updateNotes,
        modifyContent,
      });
    });
  }

  async componentDidMount(){ //根节点的全部数据操作都只由 eventproxy的广播来接收  "get-addNotes"
    // 初次登录 向后台要数据
    const response = await requestAllnotes(this.state.owner);
    //console.log("reflectino did mount", response.allNotes);
    this.setState({
      allNotes: response.allNotes,
      modifyContent:"get-allNotes",
    });
    
    //注册广播接收
    this.registerBroadcast();

    //设置10秒定时更新
    this.intervalId = setInterval (async function (){
      if(Object.keys(this.state.updateNotes).length === 0) return;
      await requestUpdate(this.state.updateNotes);
      this.setState({
        updateNotes:{},
        modifyContent:"",
      })
    }.bind(this),1000);
  }

  //解除定时器
  componentWillUnmount(){
    clearInterval(this.intervalId);
  }

  //当updateNotes变动时,不更新页面
  shouldComponentUpdate(nextProps, nextState){
   // if(nextProps) 重复登录不刷新？
   return true;
  }


  // let note = Object.assign({},currentNote);
  // delete note.complete; 更新数据的时候记得delete complete的前台临时添加的属性

  genernateNewNote = () => {
    return  {owner: this.state.owner, title: "untitled", hint: "untitled", answer: "untitled", collect:false, created:moment().format(), spaced:moment().format(),toReview: 4,url:"", trash:0};
  }

  render() {
    return (
      <div className="reflection">
        <Main allNotes = {this.state.allNotes} modifyContent={this.state.modifyContent}/>
        <Modal show={this.state.owner ? false : true}>
                    <Modal.Header closeButton/>
                    <Modal.Body>
                        <h4> You need to Login first. </h4>
                    </Modal.Body>
                    <Modal.Footer>
                    <Link to="./"><Button bsSize="large" block> Log In </Button></Link>
                    </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Reflection;

