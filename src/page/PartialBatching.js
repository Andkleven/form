import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import batchingJson from "../forms/PartialBatching.json";
import Operator from "../forms/Operator.json";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import Paper from "components/Paper";
import objectPath from "object-path";
import Batching from "components/Batching";
import { getDataFromQuery, removeSpace } from "components/Functions";
import {
  findValue,
  objectifyQuery,
  getDataToBatching
} from "components/Functions";

batchingJson.ducument.chapters = [
  Operator.chapters[batchingJson.ducument.chapters]
];

export default pageInfo => {
  const { stage, descriptionId } = pageInfo.match.params;
  const [batchingData, setBatchingData] = useState(false);
  const [finishedItem, setFinishedItem] = useState(0);
  const [fixedData, setFixedData] = useState(null);
  const [reRender, setReRender] = useState(false);
  const [batchingListIds, setBatchingListIds] = useState([]);

  const { loading, error, data } = useQuery(
    query[batchingJson.ducument.query],
    {
      variables: { id: descriptionId }
    }
  );
  useEffect(() => {
    setFixedData(objectifyQuery(data));
  }, [loading, error, data, reRender]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const update = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[batchingJson.document.query],
      variables: { id: descriptionId }
    });
    let array = objectPath.get(oldData, batchingJson.document.queryPath);
    let index = array.findIndex(
      x =>
        x.id ===
        data[batchingJson.document.queryPath.split(/[.]+/).pop()].batching.id
    );
    objectPath.set(
      oldData,
      `${batchingJson.document.queryPath}.${index}`,
      data[batchingJson.document.queryPath.split(/[.]+/).pop()].batching
    );
    let saveData = batchingJson.document.queryPath
      .split(/[.]+/)
      .splice(0, 1)[0];
    cache.writeQuery({
      query: query[batchingJson.document.query],
      variables: { id: descriptionId },
      data: { [saveData]: oldData[saveData] }
    });
  };

  return (
    <>
      {
        <Paper>
          <Batching
            data={fixedData}
            json={batchingJson}
            setBatchingData={setBatchingData}
            batchingData={batchingData}
            partialBatching={true}
            batchingListIds={batchingListIds}
            setBatchingListIds={setBatchingListIds}
            setFinishedItem={setFinishedItem}
            finishedItem={finishedItem}
            stage={stage}
          />
          <DocumentAndSubmit
            chapterAlwaysInWrite={true}
            componentsId={"leadEngineersPage"}
            geometry={
              getDataFromQuery(data, "descriptions.0", "geometry") &&
              removeSpace(
                getDataFromQuery(data, "descriptions.0", "geometry")
              ).toLowerCase()
            }
            document={batchingJson.ducument}
            partialBatching={true}
            saveButton={true}
            notSubmitButton={batchingListIds.length ? false : true}
            reRender={() => {
              setBatchingListIds([]);
              setBatchingData(false);
              setReRender(!reRender);
            }}
            data={getDataToBatching(
              fixedData,
              batchingListIds,
              batchingJson.ducument.queryPath
            )}
            stage={stage}
            speckData={getDataToBatching(
              fixedData,
              batchingListIds,
              batchingJson.ducument.spackQueryPath
            )}
            updateCache={() => update}
            batchingListIds={batchingListIds}
          />
        </Paper>
      }
    </>
  );
};
