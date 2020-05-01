import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import operatorJson from "../forms/Operator.json";
import SingelStageJson from "../forms/SingelStage.json";
import DocumentAndSubmit from "components/forms/DocumentAndSubmit";
import PaperStack from "components/layout/PaperStack";
import Paper from "components/layout/Paper";
import {
  objectifyQuery,
  formDataStructure,
  reshapeStageSting
} from "functions/general";

export default pageInfo => {
  const { itemId, geometry } = pageInfo.match.params;
  const [reRender, setReRender] = useState(false);
  const [fixedData, setFixedData] = useState(null);

  const { loading, error, data } = useQuery(query[SingelStageJson.query], {
    variables: { id: itemId }
  });
  if (data.items[0].stage) {
    SingelStageJson.chapters = [
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
        <DocumentAndSubmit
          componentsId={"SingleItem"}
          document={SingelStageJson}
          reRender={() => setReRender(!reRender)}
          data={fixedData && formDataStructure(fixedData, "items.0.operators")}
          stage={data.items[0].stage}
          speckData={
            fixedData && formDataStructure(fixedData, "items.0.leadEngineers")
          }
          geometry={geometry}
          arrayIndex={
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
