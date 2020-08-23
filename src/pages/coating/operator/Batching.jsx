import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import allBatchingJson from "templates/batching.json";
import operatorCoatedItemJson from "templates/coatedItem/operatorCoatedItem.json";
import operatorMouldJson from "templates/mould/operatorMould.json";
import Form from "components/form/Form";
import Paper from "components/layout/Paper";
import objectPath from "object-path";
import Canvas from "components/layout/Canvas";
import { useParams } from "react-router-dom";
import Batching from "components/form/components/Batching";
import {
  getBatchingJson,
  objectifyQuery,
  getDataToBatching,
  getStepFromStage,
  reshapeStageSting
} from "functions/general";
import Loading from "components/Loading";

export default () => {
  const {
    stage,
    projectId,
    descriptionId,
    geometryDefault
  } = useParams();

  const [batchingData, setBatchingData] = useState(false);
  const [batchingListIds, setBatchingListIds] = useState([]);
  const [fixedData, setFixedData] = useState(null);
  const [newDescriptionId, setNewDescriptionId] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [geometry, setGeometry] = useState("coatedItem");

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

  if (loading) return <Loading />;
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
    <Canvas>
      <Paper>
        <Batching
          data={fixedData}
          json={
            newDescriptionId[0] && fixedData
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
          batchingListIds={batchingListIds}
          setBatchingListIds={setBatchingListIds}
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
          geometry={geometry}
          notSubmitButton={!batchingListIds.length}
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
            newDescriptionId[0],
            getStepFromStage(stage) ? [getStepFromStage(stage)] : null
          )}
          stage={stage}
          specData={getDataToBatching(
            fixedData,
            batchingListIds,
            batchingJson.document.specQueryPath,
            newDescriptionId[0],
            getStepFromStage(stage) ? [getStepFromStage(stage)] : null
          )}
          updateCache={() => update}
          saveButton={!!batchingListIds.length}
          readOnlyFields={!batchingListIds[0]}
          batchingListIds={batchingListIds}
        />
      </Paper>
    </Canvas>
  );
};
