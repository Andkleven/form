import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import "./styles/styles.css";
import history from "./history";
// import { AUTH_TOKEN } from "./constants";
import Home from "./page/HomePage";
import Login from "./page/LoginPage";
import OrderPage from "./page/OrderPage";
import Item from "./page/ItemPage";
import LeadEngineerPage from "./page/LeadEngineerPage";
import Operator from "./page/Operator";

import background from "./images/trelleborg-coating-compressed.jpg";

const backgroundStyle = {
  backgroundImage: "url(" + background + ")",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat !important",
  backgroundAttachment: "fixed",
  height: "100vh"
};

class App extends Component {
  render() {
    // const authToken = localStorage.getItem(AUTH_TOKEN);
    return (
      <>
        <div style={backgroundStyle} className="">
          <Router history={history}>
            <Header />
            {/* <main className="main-content"> */}
            <Switch>
              <Route exact path="/login" component={Login} />
              {/* {!authToken && <Redirect to="/login" exact />} */}
              <Route exact path="/" component={Home} />
              <Route exact path="/operators" component={Operator} />
              <Route exact path="/order" component={OrderPage} />
              <Route path="/order/item/:_id" component={Item} />
              <Route
                path="/order/lead-engineer/:descriptionId/:itemId/:different"
                component={LeadEngineerPage}
              />
            </Switch>
            {/* </main> */}
          </Router>
        </div>
      </>
    );
  }
}
export default App;
