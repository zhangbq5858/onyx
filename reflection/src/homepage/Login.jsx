import React, { Component } from 'react';
import { FormGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';
import { Checkbox } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

import Background from './images/Login.jpeg';
import { Link} from 'react-router-dom';
import history from '../index';
import {requestLogin} from "../service/user";
// import {login} from '../service/user';

import './Login.css';


var sectionStyle = {
  height: "100%",
  width: "100%",
  backgroundSize: "cover",
  position:"fixed",
  zindex:"10",
// makesure here is String确保这里是一个字符串，以下是es6写法
  backgroundImage: `url(${Background})` 
};

//const reEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+$/;

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      Email: "",
      password:"",
      reminderMessage:"",
    }
    this.saveUser = this.saveUser.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.setReminderMessage = this.setReminderMessage.bind(this);
    //this.OnLogin = this.OnLogin.bind(this);
  }

  clearMessage = () => {
    this.setState({
      reminderMessage: "",
    })
  }

  setReminderMessage = (reminderMessage) => {
    this.setState({
      reminderMessage,
    });
    setTimeout(this.clearMessage, 3000);
  }

  

  async saveUser(e) {
    const { Email, password } = this.state;

    if(!Email){
      this.setReminderMessage("Please enter your Email");
      return;
    }

    if(!password){
      this.setReminderMessage("Please enter your password");
      return;
    }

    //判断跳转    
    const response = await requestLogin(Email,password);

    if(response.ok){
      const data = {owner: this.state.Email};
      const path = {
        pathname: "/reflection",
        state: data,
      }
      history.push(path);
    }else{
      this.setReminderMessage(response.statusText);
    }
  }

  // OnLogin() {

  //   const email = this.state.Email;
  //   const password = this.state.password; //bug: no value

  //   console.log('Login clicked', password);

  //   // // encrypt password using bycrpt with salt = 10
  //   // bcrypt.hash(password, 10, (err, password) => {
  //   //   if (err) {
  //   //     console.log(err);
  //   //     return err;
  //   //   };

  //     console.log(password);

  //     // login(email, password)
  //     //   .then(resp => {
  //     //     if (resp.status === 200) { // OK -> note page

  //     //     } else { // HTTP 401 Unauthorized -> dispaly error

  //     //     }
  //     //   })

  //   // });
  //   // if (!email) return alert('email can not be empty');
  //   // if (!password) return alert('password can not be empty');

  // }

  render() {
    return (
       //react 中无法直接在input输入，必须通过监听input onChange事件修改对应的state来达到输入的效果，
      //如果页面input过多，可以在父级监听onChange事件修改对应的state，修改state使用setSate()，
      //该方法是异步的，则在该方法之后立即访问state可能还是老数据
      <div className = "app-login" style={sectionStyle}>
        <div className = "header">
          <p className = "brand1"> <Link to="/"> Reinforcement </Link></p>
          <p className = "brand-intro">  will be your useful helper in the process of building your knowledge set. It combines the memory rules with reminding functions, helping you keep your memory habits and consolidate what you learned.</p>
        </div>
        <Form horizontal className = "center" onSubmit={(e) => (e.preventDefault())}>
          <FormGroup display={this.state.reminderMessage === "" ? "none" : "block"} style={{marginBottom: "0",}}>
            <Col sm={2}/>
            <FormControl.Static className="reminder-message"> {this.state.reminderMessage} </FormControl.Static>
          </FormGroup>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={2}>
              Email
            </Col>
            <Col sm={10}>
              <FormControl className = 'email-input' type="email" placeholder="Email" value={this.state.Email} onChange={(e) => {
                this.setState({
                  Email:e.target.value,
                });
              } }/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ControlLabel} sm={2}>
            Password
            </Col>
            <Col sm={10}>
              <FormControl className = 'pass-input' type="password" placeholder="Password" value={this.state.password} onChange={(e) => {
                this.setState({
                  password: e.target.value,
                });
              }}/>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Checkbox className = 'remember-box'>remember me</Checkbox>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button type="submit" className = 'submit-button' onClick={this.saveUser} block >
                Login 
              </Button>
            </Col>
          </FormGroup>
          <Link to="/signup" className = "transfer-button2" >Don't have an account? Sign up</Link> 
        </Form>
    </div>
    );
  }
}

export default Login;
