import React from "react";
import objectPath from "object-path";
import {
  findValue,
  reshapeStageSting,
  camelCaseToNormal,
  allNull
} from "components/functions/general";
import operatorCoatedItemJson from "templates/operator";
import Line from "components/design/Line";
import findNextStage from "components/form/stage/findNextStage.ts";
import CheckInput from "components/input/components/CheckInput";
import LightLine from "components/design/LightLine";
import batchingList from "templates/batching.json";

export default props => {
  const allFields = (chapter, itemData) => {
    let batchingData = {};
    chapter.pages.forEach(page => {
      page.fields.forEach(field => {
        let specValueList = field.specValueList;
        if (specValueList) {
          batchingData[
            Array.isArray(specValueList)
              ? specValueList[specValueList.length - 1].split(".")[
                  specValueList[specValueList.length - 1].split(".").length - 1
                ]
              : specValueList.split(".")[specValueList.split(".").length - 1]
          ] = findValue(itemData, field.specValueList, props.repeatStepList);
        } else if (field.fieldName && !props.partialBatching) {
          batchingData[field.fieldName] = findValue(
            itemData,
            Array.isArray(props.json.batching.dataPath)
              ? [...props.json.batching.dataPath, `data.${field.fieldName}`]
              : `${props.json.batching.dataPath}.data.${field.fieldName}`,
            props.repeatStepList
          );
        }
        if (field.max) {
          batchingData[field.fieldName + "max"] = field.max;
        }
        if (field.min) {
          batchingData[field.fieldName + "min"] = field.min;
        }
        if (field.routeToSpecMax) {
          batchingData[field.fieldName] = objectPath.get(
            itemData,
            field.routeToSpecMax
          );
        }
        if (field.routeToSpecMin) {
          batchingData[field.fieldName] = objectPath.get(
            itemData,
            field.routeToSpecMin
          );
        }
      });
    });
    return batchingData;
  };

  const add = (item, description, batchingData) => {
    props.setBatchingListIds(prevState => {
      return {
        ...prevState,
        [item.id]: findNextStage(
          { leadEngineer: item.leadEngineer },
          item.stage,
          description.data.geometry,
          operatorCoatedItemJson.chapters
        ).stage
      };
    });
    props.setNewDescriptionId(prevState => [
      ...prevState,
      Number(description.id)
    ]);
    if (!props.batchingData) {
      props.setBatchingData({ ...batchingData });
    }
    if (props.finishedItem) {
      props.setFinishedItem(0);
    }
  };
  const remove = item => {
    if (Object.keys(props.batchingListIds).length === 1) {
      props.setBatchingData(false);
    }
    if (props.finishedItem) {
      props.setFinishedItem(0);
    }

    let index = Object.keys(props.batchingListIds).indexOf(item.id);
    if (-1 < index) {
      props.setBatchingListIds(prevState => {
        delete prevState[Object.keys(prevState)[index]];
        return { ...prevState };
      });
      props.setNewDescriptionId(prevState => {
        prevState.splice(index, 1);
        return [...prevState];
      });
    }
  };
  const handleClick = (e, item, description, batchingData) => {
    if (e.target.checked) {
      add(item, description, batchingData);
    } else {
      remove(item, description);
    }
  };

  const Items = ({ description }) => {
    return objectPath.get(description, "items").map((item, index) => {
      let chapter =
        operatorCoatedItemJson["chapters"][reshapeStageSting(props.stage)];
      let batchingData = allFields(chapter, item);
      const batchableGeometry =
        batchingList[item.stage] &&
        batchingList[item.stage].geometry.includes(description.data.geometry);
      if (item.stage === props.stage && batchableGeometry) {
        const disabled =
          item.stage === props.stage &&
          !(
            !props.batchingData ||
            JSON.stringify(batchingData) === JSON.stringify(props.batchingData)
          );
        return (
          <CheckInput
            className="mt-3"
            disabled={disabled}
            key={`${index}-${item.itemId}`}
            onChangeInput={e => handleClick(e, item, description, batchingData)}
            id={`${index}-${description.id}-batching-check`}
            value={
              Object.keys(props.batchingListIds).find(
                id => Number(id) === Number(item.id)
              )
                ? true
                : false
            }
            label={`${item.itemId}`}
          />
        );
      } else if (item.stage === props.stage) {
        return (
          <div key={`${index}-${item.itemId}`}>
            <s className="text-muted">{item.itemId}</s>
          </div>
        );
      } else {
        return null;
      }
    });
  };
  const checkInputs = (data, descriptionId) => {
    if (data) {
      return objectPath
        .get(data, "projects.0.descriptions")
        .map((description, index) => {
          const batchableGeometry =
            batchingList[props.stage] &&
            batchingList[props.stage].geometry.includes(
              description.data.geometry
            );
          if (
            batchableGeometry &&
            props.json.geometry.includes(description.data.geometry) &&
            ((descriptionId &&
              Number(description.id) === Number(descriptionId)) ||
              !descriptionId ||
              Number(descriptionId) === 0)
          ) {
            return (
              <div
                key={`${index}-${description.id}-batching-description`}
                className="mb-3"
              >
                {!!description &&
                  !Items({ description }).every(
                    element => element === null
                  ) && (
                    <>
                      <div>
                        {description.data.descriptionNameMaterialNo}{" "}
                        <div className="text-secondary d-inline">
                          ({description.data.geometry})
                        </div>
                      </div>
                      <LightLine></LightLine>
                      <Items
                        key={`${index}-${description.id}-batching`}
                        description={description}
                      />
                    </>
                  )}
              </div>
            );
          } else {
            return null;
          }
        });
    } else {
      return [null];
    }
  };
  return (
    <div>
      <h3 style={{ position: "relative", top: ".15em" }}>
        {props.partialBatching && "Partial"} Batching for{" "}
        {camelCaseToNormal(props.stage)}
      </h3>
      <Line></Line>
      {checkInputs(props.data, props.descriptionId).every(allNull) ? (
        <p>No items on this stage</p>
      ) : (
        <>
          <p>Pick what items to batch below:</p>
          {checkInputs(props.data, props.descriptionId)}
        </>
      )}
    </div>
  );
};
