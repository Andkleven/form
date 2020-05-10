/**
 * Test
 */

import React from "react";
import Filter from "components/search/components/Filter";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/leadEngineer/Query";
import { objectifyQuery } from "functions/general";
import LoadingAnimation from "./components/LoadingAnimation";
import ErrorMessage from "./components/ErrorMessage";
import { getUser, getRole, decideSearchView } from "functions/user.ts";

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
  ...props
}) => {
  let { loading, error, data } = useQuery(query["OPERATOR_PROJECTS"]);
  data = objectifyQuery(data);

  const user = getUser();
  const role = getRole(user);
  const view = decideSearchView(role);

  if (loading) {
    return LoadingAnimation;
  } else if (error) {
    return <ErrorMessage error={error} />;
  } else {
    return (
      <Filter
        {...props}
        iconSize={iconSize}
        iconStyle={iconStyle}
        rowStyle={rowStyle}
        data={data}
        view={view}
      />
    );
  }
};
