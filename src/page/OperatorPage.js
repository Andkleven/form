import React from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import Paper from "components/Paper";
import ProjectTree from "components/tree/ProjectTree";
import { expandJson, searchProjects } from "components/Functions";

export default () => {
  const { loading, error, data } = expandJson(
    useQuery(query["OPERATOR_PROJECTS"], {
      variables: { leadEngineerDone: true, operatorDone: false }
    })
  );

  const results = searchProjects(data, "e");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <>
      <Paper darkMode>
        <ProjectTree data={data} />
      </Paper>
    </>
  );
};
