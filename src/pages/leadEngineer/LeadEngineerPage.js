import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import leadEngineersCoatedItemJson from "templates/coatedItem/leadEngineerCoatedItem.json";
import leadEngineersMouldJson from "templates/mould/leadEngineerMould.json";
import Form from "components/form/Form";
import Paper from "components/layout/Paper";
import history from "functions/history";
import { objectifyQuery, coatedItemOrMould } from "functions/general";
import Canvas from "components/layout/Canvas";
import { Prompt } from "react-router-dom";

let leadEngineersJson = leadEngineersCoatedItemJson;

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
  leadEngineersJson = coatedItemOrMould(
    geometry,
    leadEngineersCoatedItemJson,
    leadEngineersMouldJson
  );
  const { loading, error, data } = useQuery(query[leadEngineersJson.query], {
    variables: { id: itemId }
  });
  useEffect(() => {
    setFixedData(objectifyQuery(data));
  }, [loading, error, data, reRender]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <Canvas>
      <Prompt
        when={true}
        message="Unsaved changes will be lost, are you sure?"
      />
      <Paper full>
        <Form
          componentsId={"leadEngineersPage"}
          document={leadEngineersJson}
          reRender={() => setReRender(!reRender)}
          data={fixedData}
          getQueryBy={itemId}
          descriptionId={descriptionId}
          itemId={itemId}
          sendItemId={Number(unique)}
          backButton={() => history.push(`/project/${projectId}`)}
          // finalButton={console.log("finalButton")}
        />
      </Paper>
    </Canvas>
  );
};
