import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import "styles/styles.css";
import history from "./history";
// import { AUTH_TOKEN } from "./constants";
import Home from "./page/HomePage";
import Login from "./page/LoginPage";
import Item from "./page/ItemPage";
import LeadEngineerPage from "./page/LeadEngineerPage";
import OperatorPage from "./page/OperatorPage";
import Div100vh from "react-div-100vh";
import PartialBatching from "./page/PartialBatching";
import BatchingTest from "./page/BatchingTest";

import background from "./images/trelleborg-coating-compressed.jpg";

const backgroundStyle = {
  backgroundImage: "url(" + background + ")",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat !important",
  backgroundAttachment: "fixed",
  height: "100%"
};
export default () => (
  <>
    <Div100vh className="bg-secondary">
      <div style={backgroundStyle}>
        <Router history={history}>
          <Header />
          <Switch>
            <Route exact path="/login" component={Login} />
            {/* {!authToken && <Redirect to="/login" exact />} */}
            <Route exact path="/" component={Home} />
            <Route exact path="/operator" component={OperatorPage} />
            <Route exact path="/orders" component={OperatorPage} />
            <Route path="/order/item/:_id" component={Item} />
            <Route
              path="/order/lead-engineer/:descriptionId/:itemId/:different"
              component={LeadEngineerPage}
            />
            <Route
              path="/batching/:stage/:descriptionId"
              component={BatchingTest}
            />
            <Route
              path="/partial-batching/:stage/:descriptionId"
              component={PartialBatching}
            />
          </Switch>
        </Router>
      </div>
    </Div100vh>
  </>
);
