import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import json from "../forms/BatchingPriming.json";
import DocumentAndSubmit from "../components/DocumentAndSubmit";
import { Card, Container } from "react-bootstrap";
import Batching from "../components/Batching";

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
        <Container className="mt-0 mt-sm-3 p-0">
          <Card
            className="shadow-sm"
            style={{ minHeight: "80vh", height: "100%" }}
          >
            <Card.Body>
              <Batching
                data={data}
                json={json.batching}
                setBatchingData={setBatchingData}
                batchingListIds={batchingListIds}
                batchingData={batchingData}
                setBatchingListIds={setBatchingListIds}
              />
              <DocumentAndSubmit
                componentsId={"leadEngineerPage"}
                document={json.ducument}
                reRender={() => {
                  setBatchingData(false);
                  setBatchingListIds([]);
                }}
                data={data}
                batchingData={batchingData}
                batchingListIds={batchingListIds}
              />
            </Card.Body>
          </Card>
        </Container>
      }
    </>
  );
};
