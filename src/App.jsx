import React, { useState, useMemo, useEffect } from "react";
import { AUTH_TOKEN } from "./constants";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import history from "./functions/history";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import CreateProject from "./pages/coating/leadEngineer/CreateProject";
import LeadEngineerPage from "./pages/coating/leadEngineer/LeadEngineerPage";
import Batching from "./pages/coating/operator/Batching";
import QualityControl from "./pages/coating/qualityControl/QualityControl";
import SingleItem from "./pages/coating/operator/SingleItem";
import Files from "components/Files";
import { ProjectProvider } from "components/explorer/components/ProjectContext";
import { ItemContext } from "components/contexts/ItemContext";
import mutations from "graphql/mutation";
import { useMutation } from "@apollo/react-hooks";
import "styles/icons";

export default () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem(AUTH_TOKEN))

  useEffect(() => {
    setAuthToken(localStorage.getItem(AUTH_TOKEN))
  }, [])

  const [mutation] = useMutation(
    mutations["VERIFY_TOKEN"],
    {
      onError: () => { setAuthToken(undefined) }
    }
  );
  useEffect(() => {
    mutation({
      variables: {
        token: authToken
      }
    })

  }, [authToken, mutation])

  const [item, setItem] = useState({
    id: null,
    name: null,
    description: null,
    stage: null
  });
  const itemValue = useMemo(() => ({ item, setItem }), [item, setItem]);

  return (
    <ProjectProvider>
      <ItemContext.Provider value={itemValue}>
        <Router history={history}>
          <Switch>
            {/* Login */}
            < Route exact path="/login" component={Login} />
            {!authToken && <Redirect to="/login" exact />}

            {/* Home */}
            <Route exact path="/">
              <Home />
            </Route>

            {/* Create Project (Lead Engineer) */}
            <Route path="/coating/project/:id" component={CreateProject} />

            {/* Create Project (Lead Engineer) */}
            <Route path="/packer/project/:id" component={CreateProject} />

            {/* Create Items (Lead Engineer) */}
            <Route
              path="/coating/lead-engineer/:projectId/:descriptionId/:itemId/:unique/:geometry"
              component={LeadEngineerPage}
            />


            {/* Batching (Operator) */}
            {/* <Route
              path="/coating/batching/:stage/:projectId/:descriptionId/:geometry"
              component={Batching}
            /> */}
            <Route path="/coating/batching/:stage/:projectId" component={Batching} />

            {/* Single Item (Operator) */}
            <Route
              path="/coating/single-item/:projectId/:descriptionId/:itemId/:geometry"
              component={SingleItem}
            />

            {/* Final Inspection (Quality Control) */}
            <Route
              path="/coating/single-item/:projectId/:descriptionId/:itemId/:geometry"
              component={QualityControl}
            />
            <Route path="/file/:filename">
              <Files />
            </Route>
          </Switch>
        </Router>
      </ItemContext.Provider>
    </ProjectProvider>
  );
};
