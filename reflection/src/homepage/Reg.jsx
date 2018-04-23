import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import { Button, Form } from 'react-bootstrap';
import { FormGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Start.css';
import Background from './images/Reg.jpg';
import './Reg.css';
import '../react-datepicker.css';
import {requestRegister} from "../service/user";
import history from '../index';



var sectionStyle = {
  height: "100%",
  width: "100%",
  backgroundSize: "cover",
  position:"fixed",
  zindex:"10",
// makesure here is String确保这里是一个字符串，以下是es6写法
  backgroundImage: `url(${Background})` 
};

class Reg extends Component {
  constructor(props){
    super(props);
    this.state = {
      repassword:"",
			password:"",
			firstName:"",
			lastName:"",
			email:"",
			phone:"",
			birthday: null,
      gender:"",
      reminderMessage:"",
    }
    this.stateChange = this.stateChange.bind(this);
    this.registerFunc = this.registerFunc.bind(this);
    this.setReminderMessage = this.setReminderMessage.bind(this);
    this.clearMessage = () => {
      this.setState({
        reminderMessage: "",
      })
    }
  }

  stateChange(e, name){
    //Event对象代表事件的状态，比如事件在其中发生的元素、键盘按键的状态、鼠标的位置、鼠标按钮的状态。
    this.setState({
      [name]: e.target.value,
    })
  }

  setReminderMessage = (reminderMessage) => {
    this.setState({
      reminderMessage,
    });
    setTimeout(this.clearMessage, 3000);
  }

  async registerFunc() {
    if(!this.state.firstName || !this.state.lastName){
        this.setReminderMessage("Please enter your name");
        return;
    }
    if(!this.state.email){
      this.setReminderMessage("Please enter your Email");
      return;
    }
    if(!this.state.password) {
      this.setReminderMessage("Please enter your password");
      return;
    }
    if(!this.state.repassword || this.state.password !== this.state.repassword) {
      this.setReminderMessage("Please confirm your password");
      return;
    }

    const userInfo = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    };
    const response = await requestRegister(userInfo);
    if(response.ok){
      const data = {owner: this.state.email};
      const path = {
        pathname: "/reflection",
        state: data,
      }
      history.push(path);
    }else{
      this.setReminderMessage(response.statusText);
    }

}

  render() {
    return (
			//react 中无法直接在input输入，必须通过监听input onChange事件修改对应的state来达到输入的效果，
      //如果页面input过多，可以在父级监听onChange事件修改对应的state，修改state使用setSate()，
      //该方法是异步的，则在该方法之后立即访问state可能还是老数据
      <div id = "app-reg" style={sectionStyle}>
        <div className = "formContent">
           <h1 className ="sign-in"> <Link to="/" > Welcome to our Reinforcement community </Link></h1>
            <Form className = "center-form" onSubmit={(e) => (e.preventDefault())}>
                <FormGroup display={this.state.reminderMessage === "" ? "none" : "block"} style={{marginBottom: "0",}}>
                  <Col sm={2}/>
                  <FormControl.Static className="reminder-message"> {this.state.reminderMessage} </FormControl.Static>
                </FormGroup>
                <FormGroup controlId="formFirstName">
                  <ControlLabel> First Name </ControlLabel>
                  <FormControl type="text" value={this.state.firstName} placeholder="First Name" onChange={(e)=>this.stateChange(e,"firstName")}/>
                </FormGroup>

                <FormGroup controlId="formLastName">
                  <ControlLabel> Last Name </ControlLabel>
                  <FormControl type="text" value={this.state.lastName} placeholder="Last Name" onChange={(e)=>this.stateChange(e,"lastName")}/>
                </FormGroup>

                <FormGroup controlId="formEmail">
                  <ControlLabel> Email </ControlLabel>
                  <FormControl type="email" value={this.state.email} placeholder="Email" onChange={(e)=>this.stateChange(e,"email")}/>
                </FormGroup>

                <FormGroup controlId="formPassword">
                  <ControlLabel>Password</ControlLabel>
                  <FormControl type="password" placeholder="Password" value={this.state.password} onChange={(e)=>this.stateChange(e,"password")}/>
                </FormGroup>

                <FormGroup controlId="formRePassword">
                  <ControlLabel>Comfirm Password</ControlLabel>
                  <FormControl type="password" placeholder="Comfirm Password"  value={this.state.repassword} onChange={(e)=>this.stateChange(e,"repassword")}/>
                </FormGroup>

                <div className = "both">
                  <div> <Button className = "register-button" onClick={this.registerFunc} type="submit">Register now</Button>  <Link to="/" style={{marginLeft:"50px"}}><Button className = "register-button"> Cancel</Button></Link></div>
                  <div style={{height:"13px"}}/>
                  <Link to="/signin" className = "transfer-button" >Already have an account</Link> 
                </div>
            </Form>
        </div>
      </div>
		);
  }
}

export default Reg;
