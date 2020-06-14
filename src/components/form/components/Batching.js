import React, { Fragment } from "react";
import objectPath from "object-path";
import { useMutation } from "@apollo/react-hooks";
import { Form } from "react-bootstrap";
import {
  findValue,
  coatedItemOrMould,
  reshapeStageSting
} from "functions/general";
import mutations from "graphql/mutation";
import operatorCoatedItemJson from "templates/coatedItem/operatorCoatedItem.json";
import operatorMouldJson from "templates/mould/operatorMould.json";
import FindNextStage from "components/form/stage/findNextStage.ts";

export default props => {
  const [submitStage] = useMutation(mutations["ITEM"]);

  const allFields = (chapter, itemData) => {
    let batchingData = {};
    chapter.pages.forEach(page => {
      page.fields.forEach(field => {
        let specValueList = field.specValueList;
        if (specValueList) {
          batchingData[
            specValueList.split(".")[specValueList.split(".").length - 1]
          ] = findValue(itemData, field.specValueList, props.repeatStepList);
        } else if (field.fieldName && !props.partialBatching) {
          batchingData[field.fieldName] = findValue(
            itemData,
            Array.isArray(props.json.batching.dataPath)
              ? [...props.json.batching.dataPath, `data.${field.fieldName}`]
              : [props.json.batching.dataPath, `data.${field.fieldName}`],
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
          batchingData[field.fieldName + "routeToSpecMax"] = objectPath.get(
            itemData,
            field.routeToSpecMax
          );
        }
        if (field.routeToSpecMin) {
          batchingData[field.fieldName + "routeToSpecMin"] = objectPath.get(
            itemData,
            field.routeToSpecMin
          );
        }
      });
    });
    return batchingData;
  };

  const add = (item, description, batchingData) => {
    props.setBatchingListIds(prevState => [...prevState, Number(item.id)]);
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
    if (props.batchingListIds.length === 1) {
      props.setBatchingData(false);
    }
    if (props.finishedItem) {
      props.setFinishedItem(0);
    }

    let index = props.batchingListIds.indexOf(Number(item.id));
    if (-1 < index) {
      props.setBatchingListIds(prevState => {
        prevState.splice(index, 1);
        return [...prevState];
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

  const allRequiredSatisfied = (itemData, chapter) => {
    let allRequiredFulfilled = true;
    chapter.pages.forEach(page => {
      page.fields.forEach(field => {
        if (field.fieldName && field.required && !field.specValueList) {
          let value = findValue(
            itemData,
            Array.isArray(props.json.batching.dataPath)
              ? [...props.json.batching.dataPath, `data.${field.fieldName}`]
              : [props.json.batching.dataPath, `data.${field.fieldName}`],
            props.repeatStepList
          );
          if ([null, undefined, "", false].includes(value)) {
            allRequiredFulfilled = false;
          }
          let min;
          let max;
          if (field.routeToSpecMin) {
            min = objectPath.get(itemData, field.routeToSpecMin);
          } else if (field.min) {
            min = field.min;
          }
          if (field.routeToSpecMax) {
            max = objectPath.get(itemData, field.routeToSpecMax);
          } else if (field.max) {
            max = field.max;
          }
          if (min !== undefined && value < min) {
            allRequiredFulfilled = false;
          }
          if (max !== undefined && max < value) {
            allRequiredFulfilled = false;
          }
        }
      });
    });
    return allRequiredFulfilled;
  };

  const Item = ({ description }) => {
    return objectPath.get(description, "items").map((item, index) => {
      let itemJson = coatedItemOrMould(
        description.data.geometry,
        operatorCoatedItemJson,
        operatorMouldJson
      );
      let chapter = itemJson["chapters"][reshapeStageSting(props.stage)];
      let batchingData = allFields(chapter, item);
      if (
        item.stage === props.stage &&
        (!props.batchingData ||
          JSON.stringify(batchingData) === JSON.stringify(props.batchingData))
      ) {
        return (
          <Fragment key={`${index}-fragment`}>
            {props.partialBatching && allRequiredSatisfied(item, chapter) ? (
              <button
                key={`${index}-button`}
                onClick={() => {
                  submitStage({
                    variables: {
                      stage: FindNextStage(
                        item,
                        props.stage,
                        description.data.geometry
                      ),
                      id: item.id
                    }
                  });
                }}
              >
                {" "}
                Finished
              </button>
            ) : null}
            <Form.Check
              key={`${index}-check`}
              className="text-success"
              onChange={e => handleClick(e, item, description, batchingData)}
              id={`custom-${props.type}-${props.fieldName}-${props.indexId}`}
              checked={
                props.batchingListIds.find(id => Number(id) === Number(item.id))
                  ? true
                  : false
              }
              label={item.itemId}
            />
          </Fragment>
        );
      } else if (item.stage === props.stage) {
        // samme stage, men forskjellig data
        return (
          <div key={`${index}-text`} className="text-danger">
            {item.itemId}
          </div>
        );
      } else {
        //  På et annet stage
        return null;
      }
    });
  };

  return (
    <div className="text-center">
      <h4>Stage: {props.stage}</h4>
      {props.data &&
        objectPath
          .get(props.data, "projects.0.descriptions")
          .map((description, index) => {
            if (
              (props.descriptionId &&
                Number(description.id) === Number(props.descriptionId)) ||
              !props.descriptionId ||
              Number(props.descriptionId) === 0
            ) {
              return (
                <Fragment key={index}>
                  <h5>
                    {description.data.description} - {description.data.geometry}{" "}
                  </h5>
                  <Item description={description} />
                </Fragment>
              );
            } else {
              return null;
            }
          })}
    </div>
  );
};
