import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import Header from "components/layout/Header";
import history from "./history";
import { AUTH_TOKEN } from "./constants";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
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
import background from "./images/trelleborg-coating-compressed.jpg";

const backgroundStyle = {
  backgroundImage: "url(" + background + ")",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat !important",
  backgroundAttachment: "fixed",
  height: "100%"
};

export default () => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <Div100vh className="bg-secondary">
      <div style={backgroundStyle}>
        <Router history={history}>
          <Header />
          <Switch>
            {/* Login */}
            <Route exact path="/login" component={Login} />
            {!authToken && <Redirect to="/login" exact />}
            {/* Home */}

            <Route exact path="/" component={Home} />
            {/* Lead Engineer: Create Project */}
            <Route path="/order/item/:_id" component={Item} />
            {/* Lead Engineer: Create Items */}
            <Route
              path="/order/lead-engineer/:descriptionId/:itemId/:different/:geometry"
              component={LeadEngineerPage}
            />

            {/* Operator: Batching */}
            <Route
              path="/batching/:stage/:descriptionId"
              component={Batching}
            />
            {/* Operator: Partial Batching */}
            <Route
              path="/partial-batching/:stage/:descriptionId"
              component={PartialBatching}
            />
            {/* Operator: Single Item */}
            <Route
              path="/single-item/:itemId/:geometry"
              component={SingleItem}
            />

            {/* Quality Control: Final Inspection */}
            <Route
              path="/quality-control/:itemId/:geometry"
              component={QualityControl}
            />

            <Route path="/file/:path" component={ViewFile} />
          </Switch>
        </Router>
      </div>
    </Div100vh>
  );
};
