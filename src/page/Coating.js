import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import operatorJson from "../forms/Operator.json";
import outSideJson from "../forms/Coating.json";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import PaperStack from "components/PaperStack";
import Paper from "components/Paper";
import { objectifyQuery, formDataStructure } from "components/Functions";

outSideJson.chapters = [operatorJson.chapters[outSideJson.chapters]];

export default pageInfo => {
  const { itemId, geometry } = pageInfo.match.params;
  const [reRender, setReRender] = useState(false);
  const [fixedData, setFixedData] = useState(null);
  const { loading, error, data } = useQuery(query[outSideJson.query], {
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
          document={outSideJson}
          reRender={() => setReRender(!reRender)}
          data={
            fixedData && formDataStructure(outSideJson, fixedData, "queryPath")
          }
          stage={data.items[0].stage}
          speckData={
            fixedData &&
            formDataStructure(outSideJson, fixedData, "spackQueryPath")
          }
          geometry={geometry}
          arrayIndex={
            data.items[0].stage && [
              Number(data.items[0].stage.split("-")[1]) - 1
            ]
          }
          itemId={itemId}
          sendItemId={true}
          getQueryBy={itemId}
        />
      </Paper>
    </PaperStack>
  );
};
