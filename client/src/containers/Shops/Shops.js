// Core Modules
import React, { Component } from 'react';
// Components
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
// Styles
import '../../assets/css/material-dashboard.css';
import './Shops.css'
// Depandancy Modules

class Shops extends Component {
    
    state = { 
        name: "",
        image: "",
        branch: "",
        location: "",
        locationsArray: ["Thiruvananthapuram", "Ernakulam", "Thrissur"]
    }

    componentDidMount = () => {
        if (!!document.getElementsByClassName('nav-open')[0]) {
            document.getElementsByClassName('nav-open')[0].classList.remove('nav-open');
        }
    }

    handleValueChange = (e) => {
        let formId = e.target.id;
        if(formId === "shop_name")
            this.setState({name: e.target.value});
        if(formId === "shop_img")
            this.setState({image: e.target.files[0]});
        if(formId === "shop_branch")
            this.setState({branch: e.target.value});
        if(formId === "shop_location")
            this.setState({location: e.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const form = document.getElementById("shop_form");
        if (form.checkValidity() === false) {
            form.classList.add("was-validated-custom");
            // Form is invalid (Incomplete)
            console.log("Invalid");
        } else {
            // Send the data
            console.log("Success");
        }
    }

    handleClearValue = (e) => {
        e.preventDefault();
        const form = document.getElementById("shop_form");
        form.classList.remove("was-validated-custom");
        this.setState({
            name: "",
            image: "",
            branch: "",
            location: ""
        });
    }
    
    render() { 
        return ( 
            <div className="wrapper ">
                <Sidebar />
                <div className="main-panel">
                    <Navbar />
                    <div className="content">
                        <div className="container-fluid">
                            {/* Shop form */}
                            <div className="card" style={{width: "300px"}}>
                                <div className="card-body">
                                    <form id="shop_form" noValidate spellCheck="false" autoComplete="off">
                                        <div className="form-group">
                                            <label htmlFor="shop_name">Name*</label>
                                            <input
                                                id="shop_name"
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Name"
                                                value={this.state.name}
                                                onChange={this.handleValueChange}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                              Name is required
                                            </div>
                                        </div>
                                        <div style={{paddingBottom: "15px"}}>
                                            <label htmlFor="shop_img">Image</label>
                                            <input
                                                id="shop_img"
                                                type="file"
                                                onChange={this.handleValueChange}
                                            />
                                            {/* <div className="invalid-feedback">
                                              Image is required
                                            </div> */}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="shop_branch">Branch*</label>
                                            <input
                                                id="shop_branch"
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Branch"
                                                value={this.state.branch}
                                                onChange={this.handleValueChange}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                              Branch is required
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="shop_location">Location*</label>
                                            <select
                                                id="shop_location"
                                                className="form-control"
                                                value={this.state.location}
                                                onChange={this.handleValueChange}
                                                required
                                            >
                                                <option disabled value={""}>Choose Location</option>
                                                {this.state.locationsArray.map((location, i) => (
                                                    <option key={i} value={location}>{location}</option>
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                              Location is required
                                            </div>
                                        </div>
                                        <button className="btn btn-success btn-block" onClick={this.handleSubmit}>Create</button>
                                        <button className="btn btn-danger btn-block" onClick={this.handleClearValue}>Clear</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}
 
export default Shops;