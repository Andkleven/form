import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import operatorCoatedItemJson from "templates/coatedItem/operatorCoatedItem.json";
import operatorMouldJson from "templates/mould/operatorMould.json";
import SingleStageJson from "templates/singleStage.json";
import Form from "components/form/Form";
import PaperStack from "components/layout/PaperStack";
import Paper from "components/layout/Paper";
import {
  objectifyQuery,
  formDataStructure,
  reshapeStageSting,
  coatedItemOrMould
} from "functions/general";

export default pageInfo => {
  const { itemId, geometry } = pageInfo.match.params;
  const [reRender, setReRender] = useState(false);
  const [fixedData, setFixedData] = useState(null);

  let operatorJson = coatedItemOrMould(
    geometry,
    operatorCoatedItemJson,
    operatorMouldJson
  );

  const { loading, error, data } = useQuery(query[SingleStageJson.query], {
    variables: { id: itemId }
  });
  if (data.items[0].stage) {
    SingleStageJson.chapters = [
      operatorJson.chapters[reshapeStageSting(data.items[0].stage)]
    ];
  }
  useEffect(() => {
    setFixedData(objectifyQuery(data));
  }, [loading, error, data, reRender]);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <PaperStack>
      <Paper>
        <Form
          componentsId={"SingleItem"}
          document={SingleStageJson}
          reRender={() => setReRender(!reRender)}
          data={fixedData && formDataStructure(fixedData, "items.0.operators")}
          stage={data.items[0].stage}
          specData={
            fixedData && formDataStructure(fixedData, "items.0.leadEngineers")
          }
          geometry={geometry}
          repeatStepList={
            data.items[0].stage &&
            data.items[0].stage.split("Step")[1] && [
              Number(data.items[0].stage.split("Step")[1]) - 1
            ]
          }
          itemId={itemId}
          sendItemId={true}
          getQueryBy={itemId}
          saveButton={true}
        />
      </Paper>
    </PaperStack>
  );
};
