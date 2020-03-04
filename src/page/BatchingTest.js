import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import json from "../forms/BatchingPriming.json";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import Paper from "components/Paper";
import objectPath from "object-path";
import Batching from "components/Batching";
import { getDataFromQuery, removeSpace } from "components/Functions";

export default pageInfo => {
  const { stage, descriptionId } = pageInfo.match.params;
  const [batchingData, setBatchingData] = useState(false);
  const [batchingListIds, setBatchingListIds] = useState([]);
  const { loading, error, data } = useQuery(query[json.ducument.query], {
    variables: { id: descriptionId }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const update = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[json.document.query],
      variables: { id: descriptionId }
    });
    let array = objectPath.get(oldData, json.document.queryPath);
    let index = array.findIndex(
      x =>
        x.id === data[json.document.queryPath.split(/[.]+/).pop()].batching.id
    );
    objectPath.set(
      oldData,
      `${json.document.queryPath}.${index}`,
      data[json.document.queryPath.split(/[.]+/).pop()].batching
    );
    let saveData = json.document.queryPath.split(/[.]+/).splice(0, 1)[0];
    cache.writeQuery({
      query: query[json.document.query],
      variables: { id: descriptionId },
      data: { [saveData]: oldData[saveData] }
    });
  };

  return (
    <>
      {
        <Paper>
          <Batching
            data={data}
            json={json}
            setBatchingData={setBatchingData}
            batchingData={batchingData}
            batchingListIds={batchingListIds}
            setBatchingListIds={setBatchingListIds}
            stage={stage}
          />
          <DocumentAndSubmit
            componentsId={"leadEngineersPage"}
            geometry={
              getDataFromQuery(data, "descriptions.0", "geometry") &&
              removeSpace(
                getDataFromQuery(data, "descriptions.0", "geometry")
              ).toLowerCase()
            }
            document={json.ducument}
            reRender={() => {
              setBatchingListIds([]);
              setBatchingData(false);
            }}
            data={
              batchingListIds
                ? data["descriptions"][0]["items"].find(
                    item => item.id == batchingListIds[0]
                  )
                : null
            }
            stage={stage}
            speckData={
              batchingListIds
                ? data["descriptions"][0]["items"].find(
                    item => item.id == batchingListIds[0]
                  )
                : null
            }
            updateCache={() => update}
            submitNextStage={true}
            batchingListIds={batchingListIds}
          />
        </Paper>
      }
    </>
  );
};
