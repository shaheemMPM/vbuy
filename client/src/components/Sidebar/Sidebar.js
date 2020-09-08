import React from 'react';
import {Link} from 'react-router-dom';

const Sidebar = () => {

    return ( 
        <div className="sidebar" data-color="azure" data-background-color="white">
            <div className="logo">
                <span className="simple-text logo-normal">
                    VBUY
                </span>
            </div>
            <div className="sidebar-wrapper">
                <ul className="nav">
                    <li className={ window.location.pathname === "/" ? "nav-item active" : "nav-item" }>
                        <Link className="nav-link" to="/">
                            <i className="material-icons">dashboard</i>
                            <p>Dashboard</p>
                        </Link>
                    </li>
                    <li className={ window.location.pathname === "/shops" ? "nav-item active" : "nav-item" }>
                        <Link className="nav-link" to="/shops">
                            <i className="material-icons">storefront</i>
                            <p>Shops</p>
                        </Link>
                    </li>
                    <li className={ window.location.pathname === "/categories" ? "nav-item active" : "nav-item" }>
                        <Link className="nav-link" to="/categories">
                            <i className="material-icons">category</i>
                            <p>Categories</p>
                        </Link>
                    </li>
                    <li className={ window.location.pathname === "/products" ? "nav-item active" : "nav-item" }>
                        <Link className="nav-link" to="/products">
                            <i className="material-icons">shopping_cart</i>
                            <p>Products</p>
                        </Link>
                    </li>
                    <li className={ window.location.pathname === "/delivery-boys" ? "nav-item active" : "nav-item" }>
                        <Link className="nav-link" to="/delivery-boys">
                            <i className="material-icons">moped</i>
                            <p>Delivery Boys</p>
                        </Link>
                    </li>
                    <li className={ window.location.pathname === "/orders" ? "nav-item active" : "nav-item" }>
                        <Link className="nav-link" to="/orders">
                            <i className="material-icons">list_alt</i>
                            <p>Orders</p>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>       
    );
}
 
export default Sidebar;