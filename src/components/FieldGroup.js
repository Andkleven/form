import React, { useContext, useCallback } from "react";
import ReadField from "./ReadField";
import WriteFieldGroupError from "./WriteFieldGroupError";
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

  const getNewPath = useCallback(
    fieldName => {
      return `${props.path ? props.path + ".data." : ""}${fieldName}`;
    },
    [props.path]
  );

  return props.fields.map((field, index) => {
    let { min, max } = calculateMaxMin(
      field.min,
      field.routToSpeckMin,
      field.fieldSpeckMin,
      field.max,
      field.routToSpeckMax,
      field.fieldSpeckMax,
      props.speckData
    );
    if (field.line) {
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
          path={getNewPath(field.fieldName)}
          subtext={getSubtext(
            field.subtext,
            findValue(
              props.speckData,
              field.speckValueList,
              props.repeatStepList,
              field.editRepeatStepValueList
            ),
            max,
            min,
            field.maxInput,
            field.minInput,
            field.unit,
            field.required
          )}
          value={findValue(
            props.speckData,
            field.speckValueList,
            props.repeatStepList,
            field.editRepeatStepValueList
          )}
        />
      );
    } else if (
      field.readOnly ||
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
          subtext={getSubtext(
            field.subtext,
            findValue(
              props.speckData,
            field.speckValueList,
            props.repeatStepList,
            field.editRepeatStepValueList
            ),
            max,
            min,
            field.maxInput,
            field.minInput,
            field.unit,
            field.required
          )}
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
          subtext={getSubtext(
            field.subtext,
            findValue(
              props.speckData,
            field.speckValueList,
            props.repeatStepList,
            field.editRepeatStepValueList
            ),
            max,
            min,
            field.maxInput,
            field.minInput,
            field.unit,
            field.required
          )}
          label={
            field.queryVariableLabel || field.indexVariableLabel
              ? variableLabel(
                  field.label,
                  documentDateContext.documentDate,
                  field.queryVariableLabel,
                  props.repeatStepList,
                  field.editRepeatStepListVariableLabel,
                  field.indexVariableLabel ? props.repeatStep : undefined
                )
              : field.label
          }
        />
      );
    }
  });
};
