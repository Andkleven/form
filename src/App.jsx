import React, { useState, useMemo } from "react";
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
import { ItemContext } from "components/contexts/ItemContext";

import "styles/icons";

export default () => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const [item, setItem] = useState({ id: null, stage: null });
  const itemValue = useMemo(() => ({ item, setItem }), [item, setItem]);

  return (
    <ProjectProvider>
      <ItemContext.Provider
        // value={{ item, setItem }}
        value={itemValue}
      >
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
            <Route
              path="/batching/:stage/:projectId/:descriptionId/:geometry"
              component={Batching}
            />
            <Route path="/batching/:stage/:projectId" component={Batching} />

            {/* Partial Batching (Operator) */}
            <Route
              path="/partial-batching/:stage/:projectId/:descriptionId/:geometry"
              component={PartialBatching}
            />
            <Route
              path="/partial-batching/:stage/:projectId"
              component={PartialBatching}
            />

            {/* Single Item (Operator) */}
            <Route
              path="/single-item/:itemId/:geometry"
              component={SingleItem}
            />

            {/* Final Inspection (Quality Control) */}
            <Route
              path="/quality-control/:itemId/:geometry"
              component={QualityControl}
            />
            <Route path="/file/:path" component={ViewFile} />
          </Switch>
        </Router>
      </ItemContext.Provider>
    </ProjectProvider>
  );
};
