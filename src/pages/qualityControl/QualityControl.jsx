import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import operatorCoatedItemJson from "templates/coatedItem/operatorCoatedItem.json";
import operatorMouldJson from "templates/mould/operatorMould.json";
import qualityControlJson from "templates/qualityControl.json";
import Form from "components/form/Form";
import Paper from "components/layout/Paper";
import {
  objectifyQuery,
  formDataStructure,
  coatedItemOrMould
} from "functions/general";
import Canvas from "components/layout/Canvas";
import { Prompt } from "react-router-dom";
import Overview from "components/layout/Overview";

export default pageInfo => {
  const { itemId, geometry } = pageInfo.match.params;
  const [fixedData, setFixedData] = useState(null);
  const [reRender, setReRender] = useState(null);

  let operatorJson = coatedItemOrMould(
    geometry,
    operatorCoatedItemJson,
    operatorMouldJson
  );

  const { loading, error, data } = useQuery(query[qualityControlJson.query], {
    variables: { id: itemId }
  });
  useEffect(() => {
    setFixedData(objectifyQuery(data));
  }, [loading, error, data]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Canvas>
      <Overview />
      <Prompt
        when={true}
        message="Unsaved changes will be lost, are you sure?"
      />
      <Paper className="mb-3">
        <Form
          componentsId={"SingleItem"}
          document={operatorJson}
          reRender={() => setReRender(!reRender)}
          data={fixedData && formDataStructure(fixedData, "items.0.operators")}
          specData={
            fixedData && formDataStructure(fixedData, "items.0.leadEngineers")
          }
          stage={fixedData && fixedData.items[0].stage}
          stageType={geometry}
          getQueryBy={itemId}
          itemId={itemId}
          sendItemId={true}
          saveButton={true}
        />
      </Paper>
      <Paper>
        <Form
          componentsId={"finalInspectionQualityControls"}
          document={qualityControlJson}
          data={
            fixedData &&
            formDataStructure(
              fixedData,
              "items.0.finalInspectionQualityControls"
            )
          }
          specData={
            fixedData && formDataStructure(fixedData, "items.0.leadEngineers")
          }
          reRender={() => setReRender(!reRender)}
          allData={fixedData}
          stage={fixedData && fixedData.items[0].stage}
          stageType={geometry}
          getQueryBy={itemId}
          itemId={itemId}
          sendItemId={true}
          saveButton={true}
        />
      </Paper>
    </Canvas>
  );
};
