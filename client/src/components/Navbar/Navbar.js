// Core Modules
import React from 'react';

const Logout = () => {
    console.log('logout user');
}

const Navbar = () => {

    let HeaderString = '';
    if (window.location.pathname === '/') {
        HeaderString = 'Dashboard';
    }else if (window.location.pathname === '/shops') {
        HeaderString = 'Shops';
    }else if (window.location.pathname === '/categories') {
        HeaderString = 'Categories';
    }else if (window.location.pathname === '/products') {
        HeaderString = 'Products';
    }else if (window.location.pathname === '/delivery-boys') {
        HeaderString = 'Delivery Boys';
    }else if (window.location.pathname === '/orders') {
        HeaderString = 'Orders';
    }

    return ( 
        <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
            <div className="container-fluid">
            <div className="navbar-wrapper">
                <span className="navbar-brand">{HeaderString}</span>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                <span className="sr-only">Toggle navigation</span>
                <span className="navbar-toggler-icon icon-bar"></span>
                <span className="navbar-toggler-icon icon-bar"></span>
                <span className="navbar-toggler-icon icon-bar"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end">
                <form className="navbar-form">
                    <div className="input-group no-border">
                    </div>
                </form>
                <ul className="navbar-nav">
                    <li className="nav-item dropdown">
                        <span className="nav-link" id="navbarDropdownProfile" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{cursor: 'pointer'}}>
                            <i className="material-icons">person</i>
                            <p className="d-lg-none d-md-block">
                                Account
                            </p>
                        </span>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownProfile">
                        <span className="dropdown-item" onClick={Logout}>Log out</span>
                        </div>
                    </li>
                </ul>
            </div>
            </div>
        </nav>
    );
}
 
export default Navbar;