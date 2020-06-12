import { hot } from "react-hot-loader/root";
import React from "react";
import { AUTH_TOKEN } from "./constants";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import history from "./functions/history";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import CreateProject from "./pages/leadEngineer/CreateProject";
import LeadEngineerPage from "./pages/leadEngineer/LeadEngineerPage";
import PartialBatching from "./pages/operator/PartialBatching";
import Batching from "./pages/operator/Batching";
import QualityControl from "./pages/qualityControl/QualityControl";
import SingleItem from "./pages/operator/SingleItem";
import ViewFile from "components/ViewFile";
import { ProjectProvider } from "components/explorer/components/ProjectContext";

import "styles/icons";

export default hot(() => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <ProjectProvider>
      <Router history={history}>
        <Switch>
          {/* Login */}
          <Route exact path="/login" component={Login} />
          {!authToken && <Redirect to="/login" exact />}

          {/* Home */}
          <Route exact path="/">
            <Home />
          </Route>

          {/* Create Project (Lead Engineer) */}
          <Route path="/project/:id" component={CreateProject} />

          {/* Create Items (Lead Engineer) */}
          <Route
            path="/lead-engineer/:projectId/:descriptionId/:itemId/:unique/:geometry"
            component={LeadEngineerPage}
          />

          {/* Batching (Operator) */}
          <Route path="/batching/:stage/:projectId/:descriptionId/:geometry" component={Batching} />

          {/* Partial Batching (Operator) */}
          <Route
            path="/partial-batching/:stage/:descriptionId/:geometry"
            component={PartialBatching}
          />

          {/* Single Item (Operator) */}
          <Route path="/single-item/:itemId/:geometry" component={SingleItem} />

          {/* Final Inspection (Quality Control) */}
          <Route
            path="/quality-control/:itemId/:geometry"
            component={QualityControl}
          />
          <Route path="/file/:path" component={ViewFile} />
        </Switch>
      </Router>
    </ProjectProvider>
  );
});
