import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import operatorCoatedItemJson from "../forms/OperatorCoatedItem.json";
import operatorMouldJson from "../forms/OperatorMould.json";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import Paper from "components/Paper";
import PaperStack from "components/PaperStack";
import {
  objectifyQuery,
  formDataStructure,
  coatedItemORMould
} from "components/Functions";

export default pageInfo => {
  const { itemId, geometry } = pageInfo.match.params;
  const [reRender, setReRender] = useState(false);
  const [fixedData, setFixedData] = useState(null);
  let operatorJson = coatedItemORMould(
    geometry,
    operatorCoatedItemJson,
    operatorMouldJson
  );

  const { loading, error, data } = useQuery(query[operatorJson.query], {
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
          data={
            fixedData && formDataStructure(operatorJson, fixedData, "queryPath")
          }
          speckData={
            fixedData &&
            formDataStructure(operatorJson, fixedData, "spackQueryPath")
          }
          stage={fixedData && fixedData.items[0].stage}
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
