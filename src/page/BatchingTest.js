import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import json from "../forms/BatchingPriming.json";
import DocumentAndSubmit from "../components/DocumentAndSubmit";
import Batching from "./Batching";
import Paper from "components/Paper";

export default pageInfo => {
  const { id } = pageInfo.match.params;
  const [reRender, setReRender] = useState(false);
  const [batchingData, setBatchingData] = useState({});
  const [batchingList, setBatchingList] = useState([]);
  // const { loading1, error1, data: getGategory } = useQuery(query["GET_GEOMETRY"], {
  //   variables: { id: categoryId }
  // });
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
            componentsId={"leadEngineerPage"}
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
