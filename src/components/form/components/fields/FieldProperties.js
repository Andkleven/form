import React, { useContext, useCallback, useState, useEffect } from "react";
import ReadField from "./ReadField";
import WriteFieldGroupError from "./WriteFieldGroupError";
import Input from "components/input/Input";
import objectPath from "object-path";
import { DocumentDateContext, ChapterContext } from "components/form/Form";

import {
  getSubtext,
  findValue,
  calculateMaxMin,
  variableLabel
} from "functions/general";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const chapterContext = useContext(ChapterContext);
  const [subtext, setSubtext] = useState("");
  const [label, setLabel] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  useEffect(() => {
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
    setMin(min);
    setMax(max);
  }, [props.specData]);

  useEffect(() => {
    setLabel(
      props.queryVariableLabel || props.indexVariableLabel
        ? variableLabel(
            props.label,
            props.variableLabelSpec
              ? props.specData
              : documentDateContext.documentDate,
            props.queryVariableLabel,
            props.repeatStepList,
            props.editRepeatStepListVariableLabel,
            props.indexVariableLabel ? props.repeatStep : undefined
          )
        : props.label
    );
  }, [props.specData, documentDateContext.documentDate]);

  useEffect(() => {
    setSubtext(
      getSubtext(
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
      )
    );
  }, [props.specData]);

  const getNewPath = useCallback(
    fieldName => {
      return `${props.path ? props.path + ".data." : ""}${fieldName}`;
    },
    [props.path]
  );

  if (props.specValueList) {
    return (
      <ReadField
        {...props}
        key={`${props.indexId}-${props.index}`}
        readOnly={true}
        path={getNewPath(props.fieldName)}
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
  } else if (
    props.math ||
    props.setValueByIndex ||
    props.writeChapter ||
    `${props.repeatStepList}-${props.fieldName}` === chapterContext.editChapter
  ) {
    return (
      <WriteFieldGroupError
        {...props}
        key={`${props.indexId}-${props.index}`}
        path={getNewPath(props.fieldName)}
        submitButton={
          `${props.repeatStepList}-${props.fieldName}` ===
          chapterContext.editChapter
            ? true
            : false
        }
        min={min}
        max={max}
        label={label}
        subtext={subtext}
        value={objectPath.get(
          documentDateContext.documentDate,
          getNewPath(props.fieldName),
          ""
        )}
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
        oneFile={true}
        path={`${props.path}.${props.fieldName}`}
        label={label}
      />
    );
  } else {
    return (
      <ReadField
        {...props}
        key={`${props.indexId}-${props.index}`}
        path={getNewPath(props.fieldName)}
        indexId={`${props.indexId}-${props.index}`}
        index={props.index}
        value={objectPath.get(
          documentDateContext.documentDate,
          getNewPath(props.fieldName)
        )}
        subtext={subtext}
        label={label}
      />
    );
  }
};
