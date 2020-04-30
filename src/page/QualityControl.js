import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import operatorCoatedItemJson from "../forms/OperatorCoatedItem.json";
import operatorMouldJson from "../forms/OperatorCoatedItem.json";
import qualityControlCoatingItem from "../forms/QualityControlCoatingItem.json";
import qualityControlMould from "../forms/QualityControlMould.json";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import Paper from "components/Paper";
import PaperStack from "components/PaperStack";
import {
  objectifyQuery,
  formDataStructure,
  coatedItemORMould
} from "functions/general";

export default pageInfo => {
  const { itemId, geometry } = pageInfo.match.params;
  const [reRender, setReRender] = useState(false);
  const [fixedData, setFixedData] = useState(null);

  let qualityControl = coatedItemORMould(
    geometry,
    qualityControlCoatingItem,
    qualityControlMould
  );

  let operatorJson = coatedItemORMould(
    geometry,
    operatorCoatedItemJson,
    operatorMouldJson
  );

  const { loading, error, data } = useQuery(query[qualityControl.query], {
    variables: { id: itemId }
  });

  useEffect(() => {
    setFixedData(objectifyQuery(data));
  }, [loading, error, data, reRender]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <PaperStack>
      <Paper>
        <DocumentAndSubmit
          componentsId={"SingleItem"}
          document={operatorJson}
          reRender={() => setReRender(!reRender)}
          data={fixedData && formDataStructure(fixedData, "items.0.operators")}
          speckData={
            fixedData && formDataStructure(fixedData, "items.0.leadEngineers")
          }
          stage={fixedData && fixedData.items[0].stage}
          geometry={geometry}
          getQueryBy={itemId}
          itemId={itemId}
          sendItemId={true}
          saveButton={true}
        />
        <DocumentAndSubmit
          componentsId={"SingleItem"}
          document={qualityControl}
          reRender={() => setReRender(!reRender)}
          data={
            fixedData &&
            formDataStructure(
              fixedData,
              "items.0.finalInspectionQualityControls"
            )
          }
          speckData={
            fixedData && formDataStructure(fixedData, "items.0.leadEngineers")
          }
          allData={fixedData}
          geometry={geometry}
          getQueryBy={itemId}
          itemId={itemId}
          sendItemId={true}
          saveButton={true}
        />
      </Paper>
    </PaperStack>
  );
};
