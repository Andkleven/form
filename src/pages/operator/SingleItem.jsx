import React, { useState, useEffect, useContext, useRef } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import operatorJson from "templates/operator.json";
import leadEngineersJson from "templates/leadEngineer.json";
import qualityControlJson from "templates/qualityControl.json";
import Form from "components/form/Form";
import history from "functions/history";
import Paper from "components/layout/Paper";
import {
  objectifyQuery,
  formDataStructure,
  getProductionLine
} from "functions/general";
import Title from "components/design/fonts/Title";
import Canvas from "components/layout/Canvas";
import { ItemContext } from "components/contexts/ItemContext";
import { getAccess } from "functions/user.ts";
import Overview from "components/layout/Overview";
import stageAllJson from "components/form/stage/stages.json";

const stageJson = stageAllJson["all"];

export default pageInfo => {
  const access = getAccess();
  leadEngineersJson.query = qualityControlJson.query;
  operatorJson.query = qualityControlJson.query;
  const { itemId, geometry } = pageInfo.match.params;
  const itemIdsRef = useRef();
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
  }, [setItem, fixedData, item.id]);
  const finalInspection =
    access.finalInspection &&
    [
      "qualityControlCoatedItem",
      "finalInspectionAsBuilt",
      "finalInspectionPacker",
      "done"
    ].includes(stage);
  const productionLine = fixedData && getProductionLine(geometry);
  const operator = {
    update: true,
    itemId: itemId,
    itemIdsRef: itemIdsRef,
    jsonVariables: [geometry],
    componentsId: opId.current,
    document: operatorJson,
    afterSubmit: () => setReRender(!reRender),
    data: fixedData && formDataStructure(fixedData, "items.0.operator"),
    specData: fixedData && formDataStructure(fixedData, "items.0.leadEngineer"),
    saveVariables: { itemId: itemId },
    edit: access.itemEdit,
    readOnlySheet: !access.itemWrite,
    stage: stage,
    stageType: geometry,
    getQueryBy: itemId,
    backButton: !finalInspection && (() => history.push(`/`))
  };

  const qualityControl = {
    itemIdsRef: itemIdsRef,
    update: true,
    jsonVariables: [geometry],
    componentsId: "finalInspectionQualityControl",
    document: qualityControlJson,
    data:
      fixedData &&
      formDataStructure(fixedData, "items.0.finalInspectionQualityControl"),
    edit: access.itemEdit,
    specData: fixedData && formDataStructure(fixedData, "items.0.leadEngineer"),
    afterSubmit: () => setReRender(!reRender),
    allData: fixedData,
    stage: fixedData && fixedData.items[0].stage,
    itemId: itemId,
    getQueryBy: itemId,
    saveVariables: { itemId: itemId },
  };

  const indexStage = fixedData
    ? stageJson.indexOf(fixedData.items[0].stage)
    : 0;

  const packer = productionLine ==="packer";
  const coatedItem = productionLine === "coatedItem";

  return (
    <Canvas showForm={!!data}>
      <Overview itemIdsRef={itemIdsRef} />
      <Paper className="mb-3">
        <Title big align="center">
          Lead Engineer
        </Title>
        <Form
          update={true}
          itemIdsRef={itemIdsRef}
          jsonVariables={[geometry]}
          componentsId={"leadEngineersPage"}
          edit={access.specs && access.itemEdit}
          document={leadEngineersJson}
          afterSubmit={() => setReRender(!reRender)}
          data={
            fixedData && formDataStructure(fixedData, "items.0.leadEngineer")
          }
          saveVariables={{ itemId: itemId }}
          itemId={itemId}
          getQueryBy={itemId}
        />
      </Paper>
      <Paper className="mb-3">
        <Title big align="center">
          Operator
        </Title>
        <Form
          {...operator}
        />
      </Paper>
      {finalInspection && packer &&  (
        <Paper className="mb-3">
          <Title big align="center">
            Quality Control
          </Title>
          <Form
            {...qualityControl}
            stageType={"qualityControlCoatedItem"}
            componentsId={"qualityControlCoatedItem"}
            backButton={() => history.push(`/`)}
          />
        </Paper>
      )}

      {finalInspection &&
        packer &&
        stageJson.indexOf("finalInspectionAsBuilt") <= indexStage && (
          <Paper className="mb-3">
            <Title big align="center">
              Quality Control As built
            </Title>
            <Form
              {...qualityControl}
              stageType={"finalInspectionAsBuilt"}
              componentsId={"finalInspectionAsBuilt"}
            />
          </Paper>
        )}
      {access.specs &&
        packer &&
        stageJson.indexOf("touchUpPacker") <= indexStage && (
          <Paper className="mb-3">
            <Form
              {...operator}
              stageType={"touchUpPacker"}
              componentsId={"touchUpPacker"}
            />
          </Paper>
        )}
      {finalInspection &&
        packer &&
        stageJson.indexOf("finalInspectionPacker") <= indexStage && (
          <Paper className="mb-3">
            <Title big align="center">
              Quality Control
            </Title>
            <Form
              {...qualityControl}
              stageType={"finalInspectionPacker"}
              componentsId={"finalInspectionPacker"}
              backButton={() => history.push(`/`)}
            />
          </Paper>
        )}
    </Canvas>
  );
};
