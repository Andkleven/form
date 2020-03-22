import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import batchingJson from "../forms/BatchingPriming.json";
import Operator from "../forms/Operator.json";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import Paper from "components/Paper";
import objectPath from "object-path";
import Batching from "components/Batching";
import {
  findValue,
  removeSpace,
  objectifyQuery,
  getDataToBatching
} from "components/Functions";

batchingJson.ducument.chapters = [
  Operator.chapters[batchingJson.ducument.chapters]
];

export default pageInfo => {
  const { stage, descriptionId } = pageInfo.match.params;
  const [batchingData, setBatchingData] = useState(false);
  const [batchingListIds, setBatchingListIds] = useState([]);
  const [fixedData, setFixedData] = useState(null);
  const [reRender, setReRender] = useState(false);

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
    <Paper>
      <h3 className={"text-center"}>Batching</h3>
      <Batching
        data={fixedData}
        json={batchingJson}
        setBatchingData={setBatchingData}
        batchingData={batchingData}
        batchingListIds={batchingListIds}
        setBatchingListIds={setBatchingListIds}
        stage={stage}
      />
      <DocumentAndSubmit
        chapterAlwaysInWrite={true}
        componentsId={"leadEngineersPage"}
        geometry={
          fixedData &&
          findValue(fixedData, "descriptions.0.data.geometry") &&
          removeSpace(
            findValue(fixedData, "descriptions.0.data.geometry")
          ).toLowerCase()
        }
        notSubmitButton={batchingListIds.length ? false : true}
        document={batchingJson.ducument}
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
        saveButton={true}
        batchingListIds={batchingListIds}
      />
    </Paper>
  );
};
