import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineers/Query";
import json from "../forms/BatchingPriming.json";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import Paper from "components/Paper";
import Batching from "components/Batching";

export default pageInfo => {
  const { id } = pageInfo.match.params;
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
            submit={reRender}
            setBatchingData={setBatchingData}
            batchingData={batchingData}
            setBatchingList={setBatchingList}
          />
          <DocumentAndSubmit
            componentsId={"leadEngineersPage"}
            document={json.ducument}
            reRender={() => setReRender(!reRender)}
            data={data}
            batchingList={batchingList}
          />
        </Paper>
      }
    </>
  );
};
