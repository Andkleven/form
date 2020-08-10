import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import operatorCoatedItemJson from "templates/coatedItem/operatorCoatedItem.json";
import operatorMouldJson from "templates/mould/operatorMould.json";
import qualityControlCoatedItemJson from "templates/coatedItem/qualityControlCoatedItem.json";
import qualityControlMouldJson from "templates/mould/qualityControlMould.json";
import Title from "components/design/fonts/Title";
import Form from "components/form/Form";
import Paper from "components/layout/Paper";
import {
  objectifyQuery,
  formDataStructure,
  coatedItemOrMould
} from "functions/general";
import Canvas from "components/layout/Canvas";
import Overview from "components/layout/Overview";
import { ItemContext } from "components/contexts/ItemContext";

export default pageInfo => {
  const { itemId, geometry } = pageInfo.match.params;
  const [fixedData, setFixedData] = useState(null);
  const [reRender, setReRender] = useState(null);

  const { item, setItem } = useContext(ItemContext);

  let operatorJson = coatedItemOrMould(
    geometry,
    operatorCoatedItemJson,
    operatorMouldJson
  );

  let qualityControlJson = coatedItemOrMould(
    geometry,
    qualityControlCoatedItemJson,
    qualityControlMouldJson
  );

  const { loading, error, data } = useQuery(query[qualityControlJson.query], {
    variables: { id: itemId }
  });

  useEffect(() => {
    if (item.id === null) {
      setItem({
        id: fixedData ? fixedData["items"][0]["id"] : null,
        stage: fixedData ? fixedData["items"][0]["stage"] : null,
        name: fixedData ? fixedData["items"][0]["itemId"] : null,
        description: null
      });
    }
  });

  useEffect(() => {
    setFixedData(objectifyQuery(data));
  }, [loading, error, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Canvas>
      <Overview />
      <Paper className="mb-3">
        <Title big align="center">
          Operator
          </Title>
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
        <Title big align="center">
          Quality Control
          </Title>
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
