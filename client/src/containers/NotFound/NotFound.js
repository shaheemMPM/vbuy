// Core Modules
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
// Styles
import './NotFound.css';
import './fonts.css';

class NotFound extends Component {
    
    state = {  }
    
    render() { 
        return (  
            <div className="NotFound">    
                <div id="container">     
                    <p id="text">404 ERROR</p>
                    <p id="shadow">
                        <span id="glow">40</span>
                        <span id="blink">4 E</span>
                        <span id="glow">RR</span>
                        <span id="blink">OR</span>
                    </p>
                    <p id="note">Page Not Found! Go to <Link to="/">Home</Link> </p>
                </div>
            </div>
        );
    }
}
 
export default NotFound;