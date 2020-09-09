import React, { useState, useEffect, useContext, useRef } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import operatorJson from "templates/operator.json";
import leadEngineersJson from "templates/leadEngineer.json";
import qualityControlJson from "templates/qualityControl.json";
import Form from "components/form/Form";
import history from "functions/history";
import Paper from "components/layout/Paper";
import { objectifyQuery, formDataStructure } from "functions/general";
import Title from "components/design/fonts/Title";
import Canvas from "components/layout/Canvas";
import { ItemContext } from "components/contexts/ItemContext";
import { getAccess } from "functions/user.ts";
import Overview from "components/layout/Overview";

const access = getAccess();
leadEngineersJson.queryPath = "items.0.leadEngineers";
leadEngineersJson.query = qualityControlJson.query;
operatorJson.query = qualityControlJson.query;

export default pageInfo => {
  const { itemId, geometry } = pageInfo.match.params;
  const opId = useRef("SingleItem");
  const [reRender, setReRender] = useState(false);
  const [fixedData, setFixedData] = useState(null);

  const { loading, error, data } = useQuery(query[qualityControlJson.query], {
    variables: { id: itemId }
  });
  useEffect(() => {
    setFixedData(objectifyQuery(data));
  }, [loading, error, data, reRender]);

  const stage =
    fixedData &&
    fixedData.items &&
    fixedData.items[0] &&
    fixedData.items[0].stage;

  const { item, setItem } = useContext(ItemContext);

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

  const finalInspection =
    access.finalInspection && ["qualityControl", "done"].includes(stage);

  return (
    <Canvas showForm={!!data}>
      <Overview />
      {access.specs && !finalInspection && (
        <Paper className="mb-3">
          <Title big align="center">
            Lead Engineer
          </Title>
          <Form
            update={true}
            jsonVariables={[geometry]}
            componentsId={"leadEngineersPage"}
            edit={access.itemEdit}
            document={leadEngineersJson}
            reRender={() => setReRender(!reRender)}
            data={
              fixedData && formDataStructure(fixedData, "items.0.leadEngineers")
            }
            saveVariables={{ itemId: itemId }}
            getQueryBy={itemId}
          />
        </Paper>
      )}
      <Paper className="mb-3">
        {access.specs && (
          <Title big align="center">
            Operator
          </Title>
        )}

        <Form
          update={true}
          jsonVariables={[geometry]}
          componentsId={opId.current}
          document={operatorJson}
          reRender={() => setReRender(!reRender)}
          data={fixedData && formDataStructure(fixedData, "items.0.operators")}
          specData={
            fixedData && formDataStructure(fixedData, "items.0.leadEngineers")
          }
          saveVariables={{ itemId: itemId }}
          edit={access.itemEdit}
          readOnlySheet={!access.itemWrite}
          stage={stage}
          stageType={geometry}
          getQueryBy={itemId}
          saveButton={true}
          backButton={!finalInspection && (() => history.push(`/`))}
        />
      </Paper>
      {finalInspection && (
        <Paper className="mb-3">
          <Title big align="center">
            Quality Control
          </Title>
          <Form
            update={true}
            jsonVariables={[geometry]}
            componentsId={"finalInspectionQualityControls"}
            document={qualityControlJson}
            data={
              fixedData &&
              formDataStructure(
                fixedData,
                "items.0.finalInspectionQualityControls"
              )
            }
            edit={access.itemEdit}
            specData={
              fixedData && formDataStructure(fixedData, "items.0.leadEngineers")
            }
            reRender={() => setReRender(!reRender)}
            allData={fixedData}
            stage={fixedData && fixedData.items[0].stage}
            stageType={"qualityControl"}
            getQueryBy={itemId}
            saveVariables={{ itemId: itemId }}
            saveButton={true}
            backButton={() => history.push(`/`)}
          />
        </Paper>
      )}
    </Canvas>
  );
};
