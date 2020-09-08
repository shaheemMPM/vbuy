// Core Modules
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
// Custom Containers
import Login from './containers/Login/Login';
import Home from './containers/Home/Home';
import Shops from './containers/Shops/Shops';
import Categories from './containers/Categories/Categories';
import Products from './containers/Products/Products';
import DeliveryBoys from './containers/DeliveryBoys/DeliveryBoys';
import Orders from './containers/Orders/Orders';
import NotFound from './containers/NotFound/NotFound';
// Depandancy Modules
import RingLoader from "react-spinners/RingLoader";

class App extends Component {
  
  state = { 
    isLoggedIn: true,
    isLoading: false
  }

  componentDidMount = () => {
    
  }

  authChange = (data) => {
    console.log(data);
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
          !this.state.isLoading ? 
          <Switch>  
            {
              this.state.isLoggedIn ? 
                <Route path="/" exact component={Home} />
              :
                <Route 
                    path="/" exact
                    render={(props) => <Login 
                                          {...props}  
                                          logHandler={this.authChange} />} />
            }
            {
              this.state.isLoggedIn ? 
                <Route path="/shops" exact component={Shops} /> : null
            }
            {
              this.state.isLoggedIn ? 
                <Route path="/categories" exact component={Categories} /> : null
            }
            {
              this.state.isLoggedIn ? 
                <Route path="/products" exact component={Products} /> : null
            }
            {
              this.state.isLoggedIn ? 
                <Route path="/delivery-boys" exact component={DeliveryBoys} /> : null
            }
            {
              this.state.isLoggedIn ? 
                <Route path="/orders" exact component={Orders} /> : null
            }
            <Route path="*" component={NotFound} />
          </Switch>
          : null
        }
      </React.Fragment>
    );
  }
  
}
 
export default App;