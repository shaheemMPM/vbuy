// Core Modules
import React, { Component } from 'react';
// Styles
import './Login.css';
// Depandancy Modules
import RingLoader from "react-spinners/RingLoader";
import BrandImg from '../../assets/images/brand.png';

class Login extends Component {

    state = { 
        email: '',
        password: '',
        keepSigned: false,
        isLoading: false
    }
    
    emailChangeHandler = (event) => {
        this.setState({email: event.target.value});
    }

    passwordChangeHandler = (event) => {
        this.setState({password: event.target.value});
    }

    keepSignedCheckHandler = (event) => {
        this.setState({keepSigned: event.target.checked});
    }

    clearFiledsHandler = () => {
        this.setState({email: '', password: '', keepSigned: false});
    }

    loginHandler = () => {
        
    }

    render() { 
        return (
            <React.Fragment>
                <RingLoader
                    css={{display: 'block', margin: '25vh auto',borderColor: 'red'}}
                    size={150}
                    color={"#ED225D"}
                    loading={this.state.isLoading} />
                {
                    this.state.isLoading ? null :
                    <div className="LoginPage">
                        <img src={BrandImg} alt="vbuy" style={{width: '300px', display: 'block', margin: '30px auto'}} />
                        <div className="login-form">
                            <div className="divin">
                                <h2 className="text-center">Log in</h2>       
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Username" required="required" value={this.state.email} onChange={this.emailChangeHandler}/>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" placeholder="Password" required="required" value={this.state.password} onChange={this.passwordChangeHandler}/>
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-block" style={{background: '#ED225D'}} onClick={this.loginHandler}>Log in</button>
                                </div>
                                <div className="clearfix">
                                    <label className="pull-left checkbox-inline">
                                        <input type="checkbox" checked={this.state.keepSigned} onChange={this.keepSignedCheckHandler}/> Remember me
                                    </label>
                                    <span className="pull-right" onClick={this.clearFiledsHandler} style={{cursor: 'pointer'}}>Clear Feilds</span>
                                </div>        
                            </div>
                        </div>
                    </div> 
                }
            </React.Fragment> 
        );
    }
}
 
export default Login;