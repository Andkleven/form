import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import allBatchingJson from "templates/partialBatching.json";
import operatorCoatedItemJson from "templates/coatedItem/operatorCoatedItem.json";
import operatorMouldJson from "templates/mould/operatorMould.json";
import Form from "components/form/Form";
import Paper from "components/layout/Paper";
import objectPath from "object-path";
import Batching from "components/form/components/Batching";
import {
  getDataFromQuery,
  removeSpace,
  objectifyQuery,
  getDataToBatching,
  reshapeStageSting,
  coatedItemOrMould,
  getStepFromStage
} from "functions/general";

export default pageInfo => {
  const { stage, descriptionId, geometry } = pageInfo.match.params;
  const [batchingData, setBatchingData] = useState(false);
  const [finishedItem, setFinishedItem] = useState(0);
  const [fixedData, setFixedData] = useState(null);
  const [reRender, setReRender] = useState(false);
  const [batchingListIds, setBatchingListIds] = useState([]);
  let operatorJson = coatedItemOrMould(
    geometry,
    operatorCoatedItemJson,
    operatorMouldJson
  );
  let batchingJson = (allBatchingJson[
    reshapeStageSting(stage)
  ].document.chapters = [operatorJson.chapters[reshapeStageSting(stage)]]);

  const { loading, error, data } = useQuery(
    query[batchingJson.document.query],
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
      <h3 className={"text-center"}>Partial Batching</h3>
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
        arrayIndex={getStepFromStage(stage) && [getStepFromStage(stage)]}
      />
      <Form
        arrayIndex={getStepFromStage(stage) && [getStepFromStage(stage)]}
        chapterAlwaysInWrite={true}
        componentsId={"leadEngineersPage"}
        geometry={
          getDataFromQuery(data, "descriptions.0", "geometry") &&
          removeSpace(
            getDataFromQuery(data, "descriptions.0", "geometry")
          ).toLowerCase()
        }
        document={batchingJson.document}
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
          [finishedItem],
          batchingJson.document.queryPath
          // step
        )}
        stage={finishedItem ? stage : null}
        specData={getDataToBatching(
          fixedData,
          batchingListIds,
          batchingJson.document.specQueryPath
          // step
        )}
        updateCache={() => update}
        readOnlyFields={!batchingListIds[0]}
        batchingListIds={batchingListIds}
      />
    </Paper>
  );
};
