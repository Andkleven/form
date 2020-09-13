import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import operatorCoatedItemJson from "templates/operator.json";
import qualityControlCoatedItemJson from "templates/qualityControl.json";
import history from "functions/history";
import Title from "components/design/fonts/Title";
import { getAccess } from "functions/user.ts";
import Form from "components/form/Form";
import Paper from "components/layout/Paper";
import { objectifyQuery, formDataStructure } from "functions/general";
import Canvas from "components/layout/Canvas";
import Overview from "components/layout/Overview";
import { ItemContext } from "components/contexts/ItemContext";
import Loading from "components/Loading";

export default pageInfo => {
  const access = getAccess().access;
  const { itemId, geometry } = pageInfo.match.params;
  const [fixedData, setFixedData] = useState(null);
  const [reRender, setReRender] = useState(null);

  const { item, setItem } = useContext(ItemContext);

  const { loading, error, data } = useQuery(
    query[qualityControlCoatedItemJson.query],
    {
      variables: { id: itemId }
    }
  );
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

  if (loading) return <Loading />;
  if (error) return <p>Error :(</p>;

  return (
    <Canvas showForm={!!data}>
      {/* <Overview /> */}
      <Paper className="mb-3">
        <Title big align="center">
          Operator
        </Title>
        <Form
          jsonVariables={[geometry]}
          componentsId={"SingleItem"}
          document={operatorCoatedItemJson}
          reRender={() => setReRender(!reRender)}
          data={fixedData && formDataStructure(fixedData, "items.0.operator")}
          specData={
            fixedData && formDataStructure(fixedData, "items.0.leadEngineer")
          }
          stage={fixedData && fixedData.items[0].stage}
          stageType={geometry}
          readOnlySheet={!access.itemWrite}
          edit={getAccess().itemEdit}
          getQueryBy={itemId}
          saveVariables={{ itemId: itemId }}
          saveButton={true}
          update={true}
        />
      </Paper>
      <Paper>
        <Title big align="center">
          Quality Control
        </Title>
        <Form
          componentsId={"finalInspectionQualityControl"}
          document={qualityControlCoatedItemJson}
          data={
            fixedData &&
            formDataStructure(
              fixedData,
              "items.0.finalInspectionQualityControl"
            )
          }
          update={true}
          jsonVariables={[geometry]}
          edit={getAccess().itemEdit}
          specData={
            fixedData && formDataStructure(fixedData, "items.0.leadEngineer")
          }
          reRender={() => setReRender(!reRender)}
          allData={fixedData}
          stage={fixedData && fixedData.items[0].stage}
          saveVariables={{ itemId: itemId }}
          stageType={"qualityControl"}
          getQueryBy={itemId}
          saveButton={true}
          backButton={() => history.push(`/`)}
        />
      </Paper>
    </Canvas>
  );
};
