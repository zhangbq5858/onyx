import React, { Component } from 'react';
import './Start.css';

import { ButtonToolbar, Navbar,} from 'react-bootstrap';
import { Button} from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Background from './images/Start.jpg';




var sectionStyle = {
    height: "100%",
    width: "100%",
    backgroundSize: "cover",
    position:"fixed",
    zindex:"10",
  // makesure here is String确保这里是一个字符串，以下是es6写法
    backgroundImage: `url(${Background})` 
  };
  
class Start extends Component {
  
  render() {
    return (
        <div id = "app" style={sectionStyle}>
            <Navbar inverse collapseOnSelect className = "head-navbar" style={{backgroundolor: "transparent"}} >
                <Nav pullRight className = "button-bar-all">
                    <ButtonToolbar className = "button-bar1">
                        <Link to="/signin"><Button className = "login-button" bsStyle="info"><span>Log In</span></Button></Link>
                        <Link to="/signup"><Button className = "signup-button" bsStyle="success"><span>Sign Up</span></Button></Link>
                    </ButtonToolbar>
                </Nav>
            </Navbar>

            <div className = "content">
                <p className = 'header-h1'>Reinforcement</p>
                <p className = 'intro'>Join the Reinforcement family, your memory box and knowledge repostory.</p>
                <Link to="/signup"><Button className = "main-button" bsStyle="primary">Sign Up</Button></Link>
            </div>

            <Navbar inverse collapseOnSelect fixedBottom className = "foot-navbar">
                <ul className="foot-nav-ul">
                                <li className="foot-li"><a href="/about" data-track="footer-about">About</a></li>
                                <li className="foot-li"><a href="/jobs" data-track="footer-jobs">Jobs</a></li>
                                <li className="foot-li"><a href="/blog" data-track="footer-blog">Blog</a></li>
                                <li className="foot-li"><a href="/services/developer" data-track="footer-developers">Developers</a></li>
                                <li className="foot-li"><a href="/help/guidelines" data-track="footer-guidelines">Guidelines</a></li>
                                <li className="foot-li"><a href="/help/terms" data-track="footer-terms">Terms</a></li>
                                <li className="foot-li"><a href="/help/forum" data-track="footer-forum">Help forum</a></li>
                                <li className="foot-li lang-switcher">
                                    <a href="/change_language.gne?lang=en-US&csrf=" data-track="footer-language">English</a>
                                    <span className="arrow"></span>
                                </li>
                </ul>
            </Navbar>
        </div>
    
    );
  }
}

export default Start;
