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
import { USER } from "constants.js";
import ProjectTree from "components/search/components/ProjectTree";

export default props => {
  const userInfo = JSON.parse(localStorage.getItem(USER));

  let { loading, error, data } = useQuery(query["OPERATOR_PROJECTS"]);
  data = objectifyQuery(data);

  const Files = () => {
    return <ProjectTree data={data} />;
  };

  if (loading) {
    return LoadingAnimation;
  } else if (error) {
    return <ErrorMessage error={error} />;
  } else {
    return (
      <>
        <Filter
          data={data}
          view={props.view}
          defaultFilters={props.defaultFilters}
          defaultSearch={props.defaultSearch}
        />
        <Files />
      </>
    );
  }
};
