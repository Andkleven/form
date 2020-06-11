import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import allBatchingJson from "templates/batching.json";
import operatorCoatedItemJson from "templates/coatedItem/operatorCoatedItem.json";
import operatorMouldJson from "templates/mould/operatorMould.json";
import Form from "components/form/Form";
import Paper from "components/layout/Paper";
import objectPath from "object-path";
import Batching from "components/form/components/Batching";
import {
  objectifyQuery,
  getDataToBatching,
  reshapeStageSting,
  coatedItemOrMould,
  getStepFromStage
} from "functions/general";

export default pageInfo => {
  const { stage, projectId, descriptionId, geometry } = pageInfo.match.params;
  const [batchingData, setBatchingData] = useState(false);
  const [batchingListIds, setBatchingListIds] = useState([]);
  const [fixedData, setFixedData] = useState(null);
  const [indexItemList, setIndexItemList] = useState(0);
  const [reRender, setReRender] = useState(false);
  let operatorJson = coatedItemOrMould(
    geometry,
    operatorCoatedItemJson,
    operatorMouldJson
  );
  let batchingJson = allBatchingJson[reshapeStageSting(stage)]
  batchingJson.document.chapters = [operatorJson.chapters[reshapeStageSting(stage)]];

  const { loading, error, data } = useQuery(
    query[batchingJson.document.query],
    {
      variables: { id: projectId }
    }
  );
  useEffect(() => {
    setFixedData(objectifyQuery(data));
  }, [loading, error, data, reRender]);

  useEffect(() => {
    setIndexItemList(Number(descriptionId))
  }, [setIndexItemList, descriptionId])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const update = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[batchingJson.document.query],
      variables: { id: projectId }
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
      variables: { id: projectId },
      data: { [saveData]: oldData[saveData] }
    });
  };

  return (
    <Paper>
      <h3 className="text-center">Batching</h3>
      <Batching
        data={fixedData}
        json={batchingJson}
        setBatchingData={setBatchingData}
        batchingData={batchingData}
        batchingListIds={batchingListIds}
        setBatchingListIds={setBatchingListIds}
        stage={stage}
        repeatStepList={getStepFromStage(stage) ? [getStepFromStage(stage)] : [0]}
        descriptionId={descriptionId}
        indexItemList={indexItemList}
        setIndexItemList={setIndexItemList}
      />
      <Form
        repeatStepList={getStepFromStage(stage) ? [getStepFromStage(stage)] : [0]}
        chapterAlwaysInWrite={true}
        componentsId={"leadEngineersPage"}
        geometry={geometry}
        notSubmitButton={batchingListIds.length ? false : true}
        document={batchingJson.document}
        reRender={() => {
          setBatchingListIds([]);
          setBatchingData(false);
          setReRender(!reRender);
        }}
        data={getDataToBatching(
          fixedData,
          batchingListIds,
          batchingJson.document.queryPath,
          indexItemList
        )}
        stage={stage}
        specData={getDataToBatching(
          fixedData,
          batchingListIds,
          batchingJson.document.specQueryPath,
          indexItemList
        )}
        updateCache={() => update}
        saveButton={true}
        readOnlyFields={!batchingListIds[0]}
        batchingListIds={batchingListIds}
      />
    </Paper>
  );
};
