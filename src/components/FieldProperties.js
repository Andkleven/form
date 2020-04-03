import React, { useContext, useCallback, useState, useEffect } from "react";
import ReadField from "./ReadField";
import WriteFieldGroupError from "./WriteFieldGroupError";
import Input from "./Input";
import objectPath from "object-path";
import { DocumentDateContext, ChapterContext } from "./DocumentAndSubmit";

import {
  getSubtext,
  findValue,
  calculateMaxMin,
  variableLabel
} from "./Functions";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const chapterContext = useContext(ChapterContext);
  const [subtext, setSubtext] = useState();
  const [label, setLabel] = useState();
  const [min, setMin] = useState();
  const [max, setMax] = useState();

  useEffect(() => {
    let { min, max } = calculateMaxMin(
      props.min,
      props.routToSpeckMin,
      props.editRepeatStepListMin,
      props.max,
      props.routToSpeckMax,
      props.editRepeatStepListMax,
      props.repeatStepList,
      props.speckData
    );
    setMin(min);
    setMax(max);
  }, [props.speckData]);

  useEffect(() => {
    setLabel(
      props.queryVariableLabel || props.indexVariableLabel
        ? variableLabel(
            props.label,
            props.variableLabelWithSpeckData
              ? props.speckData
              : documentDateContext.documentDate,
            props.queryVariableLabel,
            props.repeatStepList,
            props.editRepeatStepListVariableLabel,
            props.indexVariableLabel ? props.repeatStep : undefined
          )
        : props.label
    );
  }, [props.speckData, documentDateContext.documentDate]);

  useEffect(() => {
    setSubtext(
      getSubtext(
        props.subtext,
        findValue(
          props.speckData,
          props.speckSubtextList,
          props.repeatStepList,
          props.editRepeatStepSubtextList
        ),
        props.max,
        props.min,
        props.maxInput,
        props.minInput,
        props.unit,
        props.required
      )
    );
  }, [props.speckData]);

  const getNewPath = useCallback(
    fieldName => {
      return `${props.path ? props.path + ".data." : ""}${fieldName}`;
    },
    [props.path]
  );
  return props.fields.map((field, index) => {
    if (field.speckValueList) {
      return (
        <ReadField
          {...props}
          {...field}
          key={`${props.indexId}-${index}`}
          readOnly={true}
          path={getNewPath(field.fieldName)}
          subtext={subtext}
          value={findValue(
            props.speckData,
            field.speckValueList,
            props.repeatStepList,
            field.editRepeatStepValueList
          )}
          label={label}
        />
      );
    } else if (
      field.math ||
      field.setValueByIndex ||
      props.writeChapter ||
      `${props.repeatStepList}-${field.fieldName}` ===
        chapterContext.editChapter
    ) {
      return (
        <WriteFieldGroupError
          {...field}
          {...props}
          key={`${props.indexId}-${index}`}
          path={getNewPath(field.fieldName)}
          submitButton={
            `${props.repeatStepList}-${field.fieldName}` ===
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
            getNewPath(field.fieldName),
            ""
          )}
          file={field.type === "file" ? props.file : null}
          indexId={`${props.indexId}-${index}`}
          index={index}
        />
      );
    } else if (field.type === "file") {
      return (
        <Input
          {...props}
          {...field}
          key={`${props.indexId}-${index}`}
          subtext={subtext}
          oneFile={true}
          path={`${props.path}.${field.fieldName}`}
          label={label}
        />
      );
    } else {
      return (
        <ReadField
          {...props}
          {...field}
          key={`${props.indexId}-${index}`}
          path={getNewPath(field.fieldName)}
          indexId={`${props.indexId}-${index}`}
          index={index}
          value={objectPath.get(
            documentDateContext.documentDate,
            getNewPath(field.fieldName)
          )}
          subtext={subtext}
          label={label}
        />
      );
    }
  });
};
