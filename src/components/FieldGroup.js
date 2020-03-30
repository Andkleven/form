import React, { useContext, useCallback } from "react";
import ReadField from "./ReadField";
import WriteFieldGroupError from "./WriteFieldGroupError";
import Input from "./Input";
import objectPath from "object-path";
import { DocumentDateContext, ChapterContext } from "./DocumentAndSubmit";
import Page from "./Page";
import Line from "./Line";
import {
  getSubtext,
  findValue,
  calculateMaxMin,
  variableLabel
} from "./Functions";
export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const chapterContext = useContext(ChapterContext);

  const getLabel = useCallback(
    field => {
      return field.queryVariableLabel || field.indexVariableLabel
        ? variableLabel(
            field.label,
            field.variableLabelWithSpeckData
              ? props.speckData
              : documentDateContext.documentDate,
            field.queryVariableLabel,
            props.repeatStepList,
            field.editRepeatStepListVariableLabel,
            field.indexVariableLabel ? props.repeatStep : undefined
          )
        : field.label;
    },
    [props.speckData, documentDateContext.documentDate]
  );

  const subtext = useCallback(
    (field, min, max) => {
      return getSubtext(
        field.subtext,
        findValue(
          props.speckData,
          field.speckSubtextList,
          props.repeatStepList,
          field.editRepeatStepSubtextList
        ),
        max,
        min,
        field.maxInput,
        field.minInput,
        field.unit,
        field.required
      );
    },
    [props.speckData]
  );

  const getNewPath = useCallback(
    fieldName => {
      return `${props.path ? props.path + ".data." : ""}${fieldName}`;
    },
    [props.path]
  );
  return props.fields.map((field, index) => {
    const { min, max } = calculateMaxMin(
      field.min,
      field.routToSpeckMin,
      field.editRepeatStepListMin,
      field.max,
      field.routToSpeckMax,
      field.editRepeatStepListMax,
      props.repeatStepList,
      props.speckData
    );
    if (
      field.showFieldSpackPath &&
      [null, undefined, "", false].includes(
        findValue(
          props.speckData,
          field.showFieldSpackPath,
          props.repeatStepList,
          field.editRepeatStepValueList
        )
      )
    ) {
      return null;
    } else if (field.line) {
      return <Line key={`${props.indexId}-${index}`} />;
    } else if (field.page) {
      if (
        objectPath.get(
          documentDateContext.documentDate,
          `${props.path}.${field.queryPath}`,
          null
        ) === null
      ) {
        objectPath.set(
          documentDateContext.documentDate,
          `${props.path}.${field.queryPath}`,
          []
        );
      }
      return (
        <Page
          {...field}
          key={index}
          repeatStepList={props.repeatStepList}
          submitHandler={props.submitHandler}
          submitData={props.submitData}
          thisChapter={props.thisChapter}
          stopLoop={props.stopLoop}
          mutation={props.mutation}
          readOnlyFields={props.readOnlyFields}
          showEditButton={false}
          data={objectPath.get(props.data, field.queryPath, false)}
          path={`${props.path}.${field.queryPath}`}
        />
      );
    } else if (field.speckValueList) {
      return (
        <ReadField
          {...props}
          {...field}
          key={`${props.indexId}-${index}`}
          readOnly={true}
          path={getNewPath(field.fieldName)}
          subtext={subtext(field, min, max)}
          value={findValue(
            props.speckData,
            field.speckValueList,
            props.repeatStepList,
            field.editRepeatStepValueList
          )}
          label={getLabel(field)}
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
          subtext={subtext(field, min, max)}
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
          subtext={subtext(field, min, max)}
          oneFile={true}
          path={`${props.path}.${field.fieldName}`}
          label={getLabel(field)}
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
          subtext={subtext(field, min, max)}
          label={getLabel(field)}
        />
      );
    }
  });
};
