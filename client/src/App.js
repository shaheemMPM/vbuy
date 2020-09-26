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
    let routes;
    if (this.state.isLoggedIn) {
      routes = <Switch>  
                <Route path="/" exact component={Home} />
                <Route path="/shops" exact component={Shops} />
                <Route path="/categories" exact component={Categories} />
                <Route path="/products" exact component={Products} />
                <Route path="/delivery-boys" exact component={DeliveryBoys} />
                <Route path="/orders" exact component={Orders} />
            <Route path="*" component={NotFound} />
          </Switch>
    } else {
      routes = <Switch>
        <Route 
          path="/" exact
          render={(props) => <Login 
                                {...props}  
                                logHandler={this.authChange} />} />
        <Route path="*" component={NotFound} />
      </Switch>
    }
    return ( 
      <React.Fragment>
        {
          this.state.isLoading ? 
            <RingLoader
            css={{display: 'block', margin: '25vh auto',borderColor: 'red'}}
            size={150}
            color={"#ED225D"}
            loading = {true} />
            : routes
        }
      </React.Fragment>
    );
  }
  
}
 
export default App;