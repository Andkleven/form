import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineers/Query";
import json from "../forms/BatchingPriming.json";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import Paper from "components/Paper";
import Batching from "components/Batching";

export default pageInfo => {
  const { id } = pageInfo.match.params;
  const [reRender, setReRender] = useState(false);
  const [batchingData, setBatchingData] = useState(false);
  const [batchingListIds, setBatchingListIds] = useState([]);

  const { loading, error, data } = useQuery(query[json.ducument.query], {
    variables: { id }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <>
      {
        <Paper>
          <Batching
            data={data}
            json={json.batching}
            setBatchingData={setBatchingData}
            batchingData={batchingData}
            setBatchingListIds={setBatchingListIds}
          />
          <DocumentAndSubmit
            componentsId={"leadEngineersPage"}
            document={json.ducument}
            reRender={() => setReRender(!reRender)}
            data={data}
            speckData={batchingData}
            batchingListIds={batchingListIds}
          />
        </Paper>
      }
    </>
  );
};
