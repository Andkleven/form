/**
 * Test
 */

import React from "react";
import ExplorerView from "components/explorer/components/ExplorerView";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import { objectifyQuery } from "functions/general";
import LoadingAnimation from "./components/LoadingAnimation";
import ErrorMessage from "./components/ErrorMessage";
import { getUser, getRole, roles } from "functions/user.ts";

function getFeatures(role, features) {
  switch (role) {
    case roles.admin:
      return {
        ...features,
        specs: true,
        items: true,
        edit: true,
        batch: true,
        filter: true,
        createProject: true,
        repair: true,
        archive: true,
        userConfig: true
      };
    case roles.lead:
      return {
        ...features,
        specs: false,
        items: true,
        edit: true, // Prosjektbasert
        batch: false,
        filter: false,
        createProject: false,
        repair: true,
        archive: true,
        userConfig: false
      };
    case roles.supervisor:
      return {
        ...features,
        specs: false, // På utejobb - prosjektbasert, bestemmes av LE
        items: true,
        edit: true,
        batch: false,
        filter: false,
        createProject: false,
        repair: true,
        archive: true,
        userConfig: false
      };
    case roles.operator:
      return {
        ...features,
        specs: false,
        items: true,
        edit: false,
        batch: true,
        filter: false,
        createProject: false,
        repair: true,
        archive: true,
        userConfig: false
      };
    case roles.quality:
      return {
        ...features,
        specs: false,
        items: true,
        edit: true,
        batch: true,
        filter: false,
        createProject: false,
        repair: true,
        archive: true,
        userConfig: false
      };
    case roles.spectator:
      return {
        ...features,
        specs: false,
        items: true,
        edit: false,
        batch: false,
        filter: true,
        createProject: false,
        repair: false,
        archive: true,
        userConfig: false
      };
    default:
      break;
  }
}

export default ({
  defaultFilters,
  defaultSearch,
  // animated = true,
  iconSize = "lg",
  iconStyle = {
    position: "relative",
    bottom: "0.025em",
    right: "0.25em",
    width: "1.5em",
    textAlign: "center"
  },
  rowStyle = {
    height: "2.5em"
  },
  features = {
    specs: false,
    items: false,
    edit: false,
    batch: false,
    filter: false,
    createProject: false,
    repair: false,
    archive: false,
    userConfig: false
  },
  ...props
}) => {
  let { loading, error, data } = useQuery(query["OPERATOR_PROJECTS"]);
  data = objectifyQuery(data);

  const user = getUser();
  const role = getRole(user);

  features = getFeatures(role, features);

  if (loading) {
    return LoadingAnimation;
  } else if (error) {
    return <ErrorMessage error={error} />;
  } else {
    return (
      <ExplorerView
        {...props}
        iconSize={iconSize}
        iconStyle={iconStyle}
        rowStyle={rowStyle}
        data={data}
        features={features}
      />
    );
  }
};
