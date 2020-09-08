// Core Modules
import React, { Component } from 'react';
// Components
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
// Styles
import '../../assets/css/material-dashboard.css';
// Depandancy Modules

class DeliveryBoys extends Component {
    
    state = { 

    }

    componentDidMount = () => {
        if (!!document.getElementsByClassName('nav-open')[0]) {
            document.getElementsByClassName('nav-open')[0].classList.remove('nav-open');
        }
    }
    
    render() { 
        return ( 
            <div className="wrapper ">
                <Sidebar />
                <div className="main-panel">
                    <Navbar />
                    <div className="content">
                        <div className="container-fluid">
                            
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}
 
export default DeliveryBoys;