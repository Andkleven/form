import React from "react";
import objectPath from "object-path";
import {
  findValue,
  reshapeStageSting,
  camelCaseToNormal
} from "functions/general";
import operatorCoatedItemJson from "templates/operator.json";
import Line from "components/design/Line";
import CheckInput from "components/input/components/CheckInput";
import LightLine from "components/design/LightLine";

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

  // const allRequiredSatisfied = (itemData, chapter) => {
  //   let allRequiredFulfilled = true;
  //   chapter.pages.forEach(page => {
  //     page.fields.forEach(field => {
  //       if (field.fieldName && field.required && !field.specValueList) {
  //         let value = findValue(
  //           itemData,
  //           Array.isArray(props.json.batching.dataPath)
  //             ? [...props.json.batching.dataPath, `data.${field.fieldName}`]
  //             : [props.json.batching.dataPath, `data.${field.fieldName}`],
  //           props.repeatStepList
  //         );
  //         if ([null, undefined, "", false].includes(value)) {
  //           allRequiredFulfilled = false;
  //         }
  //         let min;
  //         let max;
  //         if (field.routeToSpecMin) {
  //           min = objectPath.get(itemData, field.routeToSpecMin);
  //         } else if (field.min) {
  //           min = field.min;
  //         }
  //         if (field.routeToSpecMax) {
  //           max = objectPath.get(itemData, field.routeToSpecMax);
  //         } else if (field.max) {
  //           max = field.max;
  //         }
  //         if (min !== undefined && value < min) {
  //           allRequiredFulfilled = false;
  //         }
  //         if (max !== undefined && max < value) {
  //           allRequiredFulfilled = false;
  //         }
  //       }
  //     });
  //   });
  //   return allRequiredFulfilled;
  // };

  const Items = ({ description }) => {
    return objectPath.get(description, "items").map((item, index) => {
      let chapter =
        operatorCoatedItemJson["chapters"][reshapeStageSting(props.stage)];
      let batchingData = allFields(chapter, item);
      if (item.stage === props.stage) {
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
              props.batchingListIds.find(id => Number(id) === Number(item.id))
                ? true
                : false
            }
            label={`${item.itemId}`}
            // labelAppend={
            //   props.partialBatching &&
            //   allRequiredSatisfied(item, chapter) && (
            //     <div className="d-flex align-items-center">
            //       <div className="d-inline text-secondary">(Done)</div>
            //       <Button
            //         variant="link"
            //         className="p-0 m-0 ml-2"
            //         style={{ height: "1.5em" }}
            //         key={`${index}-${item.id}-fragment-batching-button`}
            //         onClick={() => {
            //           submitStage({
            //             variables: {
            //               stage: FindNextStage(
            //                 item,
            //                 props.stage,
            //                 description.data.geometry
            //               )["stage"],
            //               id: item.id
            //             }
            //           });
            //         }}
            //       >
            //         <FontAwesomeIcon
            //           icon={["fas", "arrow-square-right"]}
            //           className="mr-2"
            //         />
            //         Send to next stage
            //       </Button>
            //     </div>
            //   )
            // }
          />
        );
      } else if (item.stage === props.stage) {
        // samme stage, men forskjellig data
        return (
          <div key={`${index}-${item.itemId}`}>
            <s className="text-muted">
              {item.itemId}
              {/* <div className="d-inline text-secondary">
              {props.partialBatching ? (
                <div className="ml-1">(Different specifications)</div>
              ) : (
                <div className="ml-1">
                  (Different specifications or data already entered)
                </div>
              )}
            </div> */}
            </s>
          </div>
        );
      } else {
        //  På et annet stage
        return null;
        // (
        // <div className="d-flex align-items-center">
        //   <div className="d-inline text-secondary">(Different stage)</div>
        //   {item.itemId}
        // </div>
        // );
      }
    });
  };

  return (
    <div>
      <h3 style={{ position: "relative", top: ".15em" }}>
        {props.partialBatching && "Partial"} Batching for{" "}
        {camelCaseToNormal(props.stage)}
      </h3>
      <Line></Line>
      <p>Pick what items to batch below:</p>
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
          })}
    </div>
  );
};
