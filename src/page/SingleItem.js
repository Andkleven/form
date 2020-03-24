import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import operatorJson from "../forms/Operator.json";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import Paper from "components/Paper";
import PaperStack from "components/PaperStack";
import { objectifyQuery } from "components/Functions";

export default pageInfo => {
  const { itemId, geometry, stage } = pageInfo.match.params;
  const [reRender, setReRender] = useState(false);
  const [fixedData, setFixedData] = useState(null);

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
          data={fixedData}
          stage={stage}
          geometry={geometry}
          getQueryBy={itemId}
        />
      </Paper>
    </PaperStack>
  );
};
