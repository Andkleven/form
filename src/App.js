import React from "react";
import { AUTH_TOKEN } from "./constants";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import history from "./functions/history";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Item from "./pages/leadEngineer/ItemPage";
import LeadEngineerPage from "./pages/leadEngineer/LeadEngineerPage";
import PartialBatching from "./pages/operator/PartialBatching";
import Batching from "./pages/operator/Batching";
import QualityControl from "./pages/qualityControl/QualityControl";
import SingleItem from "./pages/operator/SingleItem";
import ViewFile from "components/ViewFile";
import { ProjectProvider } from "components/search/components/ProjectContext";

import "styles/icons";

export default () => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <ProjectProvider>
      <Router history={history}>
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
          <Route path="/batching/:stage/:descriptionId" component={Batching} />
          {/* Operator: Partial Batching */}
          <Route
            path="/partial-batching/:stage/:descriptionId"
            component={PartialBatching}
          />
          {/* Operator: Single Item */}
          <Route path="/single-item/:itemId/:geometry" component={SingleItem} />
          {/* Quality Control: Final Inspection */}
          <Route
            path="/quality-control/:itemId/:geometry"
            component={QualityControl}
          />
          <Route path="/file/:path" component={ViewFile} />
        </Switch>
      </Router>
    </ProjectProvider>
  );
};
