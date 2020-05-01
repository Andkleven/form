import React, { useContext, Fragment } from "react";
import SetFieldGroupData from "components/form/fields/SetFieldGroupData";
import FieldGroup from "components/form/fields/FieldGroup";
import objectPath from "object-path";
import { DocumentDateContext } from "components/form/Form";
import { getRepeatNumber } from "functions/general";

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
                key={`${props.indexId}-${index}`}
                data={itemsData}
                path={props.path ? `${props.path}.${index}` : null}
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
            path={props.path ? `${props.path}.${index}.data` : null}
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
        data={props.data ? props.data[0] : props.data}
        path={`${props.path}.0`}
        repeatStep={0}
        indexId={`${props.indexId}-0`}
      />
    );
  }
};
