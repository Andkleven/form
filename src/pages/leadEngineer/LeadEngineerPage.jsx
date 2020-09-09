import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import leadEngineersJson from "templates/leadEngineer.json";
import Form from "components/form/Form";
import Paper from "components/layout/Paper";
import history from "functions/history";
import { objectifyQuery } from "functions/general";
import Canvas from "components/layout/Canvas";
import Overview from "components/layout/Overview";
import Loading from "components/Loading";

export default pageInfo => {
  const {
    projectId,
    descriptionId,
    itemId,
    unique,
    geometry
  } = pageInfo.match.params;
  const [reRender, setReRender] = useState(false);
  const [fixedData, setFixedData] = useState(null);

  const { loading, error, data } = useQuery(query[leadEngineersJson.query], {
    variables: { id: itemId }
  });

  useEffect(() => {
    setFixedData(objectifyQuery(data));
  }, [loading, error, data, reRender]);

  if (loading) return <Loading />;
  if (error) return <p>Error :(</p>;
  return (
    <Canvas showForm={!!data}>
      <Overview />
      <Paper full>
        <Form
          componentsId={"leadEngineersPage"}
          document={leadEngineersJson}
          reRender={() => setReRender(!reRender)}
          data={fixedData}
          jsonVariables={[geometry]}
          saveVariables={{
            descriptionId:
              Number(unique) === 0 ? Number(descriptionId) : undefined,
            itemId: Number(unique) ? Number(itemId) : undefined
          }}
          getQueryBy={itemId}
          backButton={() => history.push(`/project/${projectId}`)}
        />
      </Paper>
    </Canvas>
  );
};
