import React, { useContext, Fragment } from "react";
import SetFieldGroupData from "./SetFieldGroupData";
import FieldGroup from "./FieldGroup";
import objectPath from "object-path";
import { DocumentDateContext } from "./DocumentAndSubmit";
import { getRepeatNumber } from "./Functions";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);

  if (props.repeat) {
    if (
      Array.isArray(
        objectPath.get(documentDateContext.documentDate, props.path)
      )
    ) {
      return objectPath
        .get(documentDateContext.documentDate, props.path)
        .map((itemsData, index) => {
          return (
            <Fragment key={index}>
              <SetFieldGroupData
                {...props}
                repeatStepList={
                  props.repeatStepList !== undefined
                    ? [...props.repeatStepList, index]
                    : props.arrayIndex
                    ? [...props.arrayIndex, index]
                    : [index]
                }
                repeatStep={index}
                writeChapter={props.writeChapter}
                key={`${props.indexId}-${index}`}
                data={itemsData}
                path={props.path ? `${props.path}.${index}` : null}
                fields={props.fields}
                indexId={`${props.indexId}-${index}`}
              />
              {props.delete && props.writeChapter ? (
                <button
                  type="button"
                  key={index}
                  onClick={() => props.deleteHandler(index)}
                >
                  {"❌"}
                </button>
              ) : null}
            </Fragment>
          );
        });
    } else if (!props.queryPath) {
      let arraySetFieldGroupData = [];
      let repeatNumber = getRepeatNumber(
        props.speckData,
        props.repeatGroupWithQuery,
        props.repeatStepList,
        props.editRepeatStepListRepeat
      );
      for (let index = 0; index < repeatNumber; index++) {
        arraySetFieldGroupData.push(
          <FieldGroup
            key={index}
            {...props}
            repeatStepList={
              props.repeatStepList !== undefined
                ? [...props.repeatStepList, index]
                : props.arrayIndex
                ? [...props.arrayIndex, index]
                : [index]
            }
            repeatStep={index}
            writeChapter={props.writeChapter}
            path={props.path ? `${props.path}.${index}.data` : null}
            fields={props.fields}
            indexId={`${props.indexId}-${index}`}
          />
        );
      }
      if (arraySetFieldGroupData[0]) {
        return arraySetFieldGroupData;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return (
      <SetFieldGroupData
        {...props}
        repeatStepList={
          props.repeatStepList !== undefined
            ? [...props.repeatStepList, 0]
            : props.arrayIndex
            ? [...props.arrayIndex, 0]
            : [0]
        }
        // path={props.path ? `${props.path}.0` : null}
        repeatStep={0}
        writeChapter={props.writeChapter}
        data={props.data}
        fields={props.fields}
        indexId={`${props.indexId}-0`}
      />
    );
  }
};
