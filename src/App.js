import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Header from "components/layout/Header";
// import "styles/styles.css";
import history from "./history";
// import { AUTH_TOKEN } from "./constants";
import Home from "./pages/HomePage";
// import Login from "./pages/LoginPage";
import Item from "./pages/ItemPage";
import LeadEngineerPage from "./pages/LeadEngineerPage";
import LeadEngineerStartPage from "./pages/leadEngineer/StartPage";
import OperatorPage from "./pages/OperatorPage";
import Div100vh from "react-div-100vh";
import PartialBatching from "./pages/PartialBatching";
import Batching from "./pages/Batching";
import QualityControl from "./pages/QualityControl";
import SingleItem from "./pages/SingleItem";
import ViewFile from "components/ViewFile";
import ScrollMemory from "react-router-scroll-memory";

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
          <ScrollMemory />
          <Header />
          <Switch>
            {/* <Route exact path="/login" component={Login} /> */}
            {/* {!authToken && <Redirect to="/login" exact />} */}
            <Route exact path="/" component={Home} />
            <Route exact path="/operator" component={OperatorPage} />
            <Route exact path="/orders" component={OperatorPage} />
            <Route path="/order/item/:_id" component={Item} />
            <Route
              path="/order/lead-engineer/:descriptionId/:itemId/:different/:geometry"
              component={LeadEngineerPage}
            />
            <Route
              path="/batching/:stage/:descriptionId"
              component={Batching}
            />
            <Route
              path="/partial-batching/:stage/:descriptionId"
              component={PartialBatching}
            />
            <Route
              path="/singel-item/:itemId/:geometry"
              component={SingleItem}
            />
            <Route
              path="/quality-control/:itemId/:geometry"
              component={QualityControl}
            />

            <Route path="/lead-engineer" component={LeadEngineerStartPage} />
            <Route path="/file/:path" component={ViewFile} />
          </Switch>
        </Router>
      </div>
    </Div100vh>
  </>
);
