import React, { useContext, useCallback, useEffect } from "react";
import ReadField from "./ReadField";
import ReadOnlyField from "components/form/components/fields/ReadOnlyField";
import Input from "components/input/Input";
import WriteField from "components/form/components/fields/WriteField";
import objectPath from "object-path";
import { DocumentDateContext, ChapterContext } from "components/form/Form";

import {
  getSubtext,
  findValue,
  calculateMaxMin,
  variableLabel,
  emptyField
} from "functions/general";

export default props => {
  const { documentDate, documentDateDispatch } = useContext(
    DocumentDateContext
  );
  const { editChapter } = useContext(ChapterContext);
  const getNewPath = useCallback(() => {
    if (props.type === "file") {
      return `${props.path}.${props.fieldName}`;
    }
    return `${props.path ? props.path + ".data." : ""}${props.fieldName}`;
  }, [props.path, props.fieldName, props.type]);

  useEffect(() => {
    let saveState = objectPath.get(props.backendData, getNewPath(), null);
    if (saveState === null && !props.specValueList) {
      let newState;
      if (["date", "datetime-local"].includes(props.type)) {
        newState = emptyField(saveState) ? null : new Date(saveState);
      } else {
        newState =
          props.default !== undefined
            ? props.default
            : ["checkbox", "radio", "switch"].includes(props.type)
            ? false
            : props.default === "select"
            ? props.options[0]
            : "";
      }
      documentDateDispatch({ type: "add", newState, path: getNewPath() });
    }
  }, [
    props.specValueList,
    documentDateDispatch,
    props.default,
    props.type,
    props.options,
    props.fieldName,
    getNewPath,
    props.backendData
  ]);

  let { min, max } = calculateMaxMin(
    props.min,
    props.routeToSpecMin,
    props.editRepeatStepListMin,
    props.calculateMin,
    props.max,
    props.routeToSpecMax,
    props.editRepeatStepListMax,
    props.calculateMax,
    props.repeatStepList,
    props.specData,
    props.allData
  );
  let subtext = getSubtext(
    props.subtext,
    findValue(
      props.specData,
      props.specSubtextList,
      props.repeatStepList,
      props.editRepeatStepSubtextList
    ),
    props.max,
    props.min,
    props.maxInput,
    props.minInput,
    props.unit,
    props.required,
    props.subtextMathMin,
    props.subtextMathMax,
    props.repeatStepList,
    props.allData
  );

  let label =
    props.queryVariableLabel || props.indexVariableLabel
      ? variableLabel(
          props.label,
          props.variableLabelSpec ? props.specData : documentDate,
          props.queryVariableLabel,
          props.repeatStepList,
          props.editRepeatStepListVariableLabel,
          props.indexVariableLabel ? props.repeatStep : undefined
        )
      : props.label;

  const Field = useCallback(props => 
  {if (props.specValueList) {
    return (
      <ReadField
      {...props}
      key={`${props.indexId}-${props.index}`}
      readOnly={true}
      path={getNewPath()}
      subtext={subtext}
      value={findValue(
        props.specData,
        props.specValueList,
        props.repeatStepList,
        props.editRepeatStepValueList
      )}
      label={label}
    />
    );
  } else if (props.writeChapter && (props.math || props.setValueByIndex)) {
    return (
      <small>
        <ReadOnlyField
          {...props}
          key={`${props.indexId}-${props.index}`}
          path={getNewPath()}
          submitButton={
            `${props.repeatStepList}-${props.fieldName}` === editChapter
              ? true
              : false
          }
          min={min}
          max={max}
          label={label}
          subtext={subtext}
          file={props.type === "file" ? props.file : null}
          indexId={`${props.indexId}-${props.index}`}
          index={props.index}
          className="mt-n3 mb-3"
          noLine
        />
      </small>
    );
  } else if (
    props.writeChapter ||
    `${props.repeatStepList}-${props.fieldName}` === editChapter
  ) {
    return (
      <WriteField
        {...props}
        key={`${props.indexId}-${props.index}`}
        path={getNewPath()}
        submitButton={
          `${props.repeatStepList}-${props.fieldName}` === editChapter
            ? true
            : false
        }
        min={min}
        max={max}
        label={label}
        subtext={subtext}
        file={props.type === "file" ? props.file : null}
        indexId={`${props.indexId}-${props.index}`}
        index={props.index}
      />
    );
  } else if (props.type === "file") {
    return (
      <Input
        {...props}
        key={`${props.indexId}-${props.index}`}
        subtext={subtext}
        singleFile={true}
        path={`${props.path}.${props.fieldName}`}
        label={label}
      />
    );
  } else {
    return (
      <ReadField
      {...props}
      key={`${props.indexId}-${props.index}`}
      path={getNewPath()}
      indexId={`${props.indexId}-${props.index}`}
      index={props.index}
      value={objectPath.get(props.backendData, getNewPath())}
      subtext={subtext}
      label={label}
    />
    );
  }}, [editChapter, getNewPath, label, max, min, subtext])
  return <Field {...props} />
};
