/**
 * Test
 */

import React from "react";
import ExplorerView from "components/search/components/ExplorerView";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/Query";
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
        batch: true,
        filter: true,
        createProject: true
      };
    case roles.lead:
      return {
        ...features
      };
    case roles.operator:
      return {
        ...features
      };
    case roles.quality:
      return {
        ...features
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
    batch: false,
    filter: false,
    createProject: false
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
