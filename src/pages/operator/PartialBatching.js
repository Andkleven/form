import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import allBatchingJson from "templates/batching.json";
import operatorCoatedItemJson from "templates/coatedItem/operatorCoatedItem.json";
import operatorMouldJson from "templates/mould/operatorMould.json";
import Form from "components/form/Form";
import Paper from "components/layout/Paper";
import Canvas from "components/layout/Canvas";
import objectPath from "object-path";
import Batching from "components/form/components/Batching";
import {
  getBatchingJson,
  getDataFromQuery,
  removeSpace,
  objectifyQuery,
  getDataToBatching,
  getStepFromStage,
  reshapeStageSting
} from "functions/general";

export default pageInfo => {
  const {
    stage,
    projectId,
    descriptionId,
    geometryDefault
  } = pageInfo.match.params;

  const [batchingData, setBatchingData] = useState(false);
  const [finishedItem, setFinishedItem] = useState(0);
  const [fixedData, setFixedData] = useState(false);
  const [reRender, setReRender] = useState(false);
  const [newDescriptionId, setNewDescriptionId] = useState([]);
  const [batchingListIds, setBatchingListIds] = useState([]);
  const [geometry, setGeometry] = useState("coateditem");

  useEffect(() => {
    if (geometryDefault) {
      setGeometry(geometryDefault);
    }
  }, [geometryDefault]);

  let batchingJson = getBatchingJson(
    geometry,
    operatorCoatedItemJson,
    operatorMouldJson,
    allBatchingJson,
    reshapeStageSting(stage)
  );
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
    if (Number(descriptionId)) {
      setNewDescriptionId([Number(descriptionId)]);
    }
  }, [setNewDescriptionId, descriptionId]);

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
  // console.log(newDescriptionId, batchingListIds);
  return (
    <Canvas>
      <Paper>
        <Batching
          data={fixedData}
          json={
            fixedData && newDescriptionId[0]
              ? getBatchingJson(
                  objectPath
                    .get(fixedData, "projects.0.descriptions")
                    .find(
                      description =>
                        Number(description.id) === Number(newDescriptionId[0])
                    )["data"]["geometry"],
                  operatorCoatedItemJson,
                  operatorMouldJson,
                  allBatchingJson,
                  reshapeStageSting(stage)
                )
              : batchingJson
          }
          setBatchingData={setBatchingData}
          batchingData={batchingData}
          partialBatching={true}
          batchingListIds={batchingListIds}
          setBatchingListIds={setBatchingListIds}
          setFinishedItem={setFinishedItem}
          finishedItem={finishedItem}
          stage={stage}
          repeatStepList={
            getStepFromStage(stage) ? [getStepFromStage(stage)] : [0]
          }
          descriptionId={descriptionId}
          newDescriptionId={newDescriptionId}
          setNewDescriptionId={setNewDescriptionId}
        />
        <Form
          repeatStepList={
            getStepFromStage(stage) ? [getStepFromStage(stage)] : [0]
          }
          chapterAlwaysInWrite={true}
          componentsId={"leadEngineersPage"}
          geometry={
            getDataFromQuery(data, "descriptions.0", "geometry") &&
            removeSpace(
              getDataFromQuery(data, "descriptions.0", "geometry")
            ).toLowerCase()
          }
          document={batchingJson.document}
          removeEmptyField={true}
          saveButton={!finishedItem}
          notSubmitButton={!finishedItem}
          reRender={() => {
            setBatchingListIds([]);
            setBatchingData(false);
            setFinishedItem(0);
            setReRender(!reRender);
          }}
          data={getDataToBatching(
            fixedData,
            [finishedItem],
            batchingJson.document.queryPath,
            newDescriptionId[0]
            // step
          )}
          stage={finishedItem ? stage : null}
          specData={getDataToBatching(
            fixedData,
            batchingListIds,
            batchingJson.document.specQueryPath,
            newDescriptionId[0]
            // step
          )}
          updateCache={() => update}
          readOnlyFields={!batchingListIds[0]}
          batchingListIds={batchingListIds}
        />
      </Paper>
    </Canvas>
  );
};
