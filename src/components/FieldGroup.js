import React, { useEffect, useContext } from "react";
import ReadField from "./ReadField";
import WriteFieldGroupError from "./WriteFieldGroupError";
import {
  DocumentDateContext,
  FieldsContext,
  ChapterContext
} from "./DocumentAndSubmit";
import Line from "./Line";
import {
  getSubtext,
  getDataFromQuery,
  calculateMaxMin,
  variableLabel
} from "./Functions";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const fieldsContext = useContext(FieldsContext);
  const chapterContext = useContext(ChapterContext);

  // set state to documentDate
  useEffect(() => {
    if (
      documentDateContext.documentDate[props.thisChapter][props.pageName] !==
        undefined &&
      documentDateContext.documentDate[props.thisChapter][props.pageName][
        props.repeatStep
      ] !== undefined
    ) {
      documentDateContext.setDocumentDate(prevState => ({
        ...prevState,
        [props.thisChapter]: {
          ...prevState[props.thisChapter],
          [props.pageName]: {
            ...prevState[props.thisChapter][props.pageName],
            [props.repeatStep]: {
              ...prevState[props.thisChapter][props.pageName][props.repeatStep],
              ...props.state
            }
          }
        }
      }));
    }
  }, [props.state]);

  // set information about saveing to documentDate
  useEffect(() => {
    let saveInfo = {};
    saveInfo["step"] = props.repeat ? props.repeatStep : undefined;
    saveInfo["foreignKey"] = props.foreignKey;
    saveInfo["id"] = props.id;
    documentDateContext.setDocumentDate(prevState => ({
      ...prevState,
      [props.thisChapter]: {
        ...prevState[props.thisChapter],
        [props.pageName]: {
          ...prevState[props.thisChapter][props.pageName],
          [props.repeatStep]: {
            ...prevState[props.thisChapter][props.pageName][props.repeatStep],
            saveInfo
          }
        }
      }
    }));
  }, [
    props.repeat,
    props.repeatStep,
    props.foreignKey,
    props.id,
    fieldsContext.editField,
    chapterContext.editChapter
  ]);

  return props.fields.map((value, index) => {
    let { min, max } = calculateMaxMin(
      value.min,
      value.routToSpeckMin,
      value.fieldSpeckMin,
      value.max,
      value.routToSpeckMax,
      value.fieldSpeckMax,
      props.speckData
    );
    if (value.line) {
      return <Line key={`${props.indexId}-${index}`} />;
    } else if (value.routToSpeckValue && value.fieldSpeckValue) {
      return (
        <ReadField
          {...props}
          {...value}
          subtext={getSubtext(
            value.subtext,
            props.speckData,
            value.routToSpeckSubtext,
            value.fieldSpeckSubtext,
            max,
            min,
            value.maxInput,
            value.minInput,
            value.unit,
            value.required
          )}
          key={`${props.indexId}-${index}`}
          value={getDataFromQuery(
            props.speckData,
            value.routToSpeckValue,
            value.fieldSpeckValue
          )}
        />
      );
    } else if (
      value.readOnly ||
      props.writeChapter ||
      `${props.indexId}-${index}` === fieldsContext.editField
    ) {
      return (
        <WriteFieldGroupError
          {...value}
          {...props}
          key={`${props.indexId}-${index}`}
          submitButton={
            `${props.indexId}-${index}` === fieldsContext.editField
              ? true
              : false
          }
          min={min}
          max={max}
          subtext={getSubtext(
            value.subtext,
            props.speckData,
            value.routToSpeckSubtext,
            value.fieldSpeckSubtext,
            max,
            min,
            value.maxInput,
            value.minInput,
            value.unit,
            value.required
          )}
          value={
            props.state[value.fieldName] ? props.state[value.fieldName] : ""
          }
          file={value.type === "file" ? props.file : null}
          indexId={`${props.indexId}-${index}`}
          index={index}
        />
      );
    } else {
      return (
        <ReadField
          {...props}
          {...value}
          key={`${props.indexId}-${index}`}
          indexId={`${props.indexId}-${index}`}
          index={index}
          value={props.state[value.fieldName]}
          subtext={getSubtext(
            value.subtext,
            props.speckData,
            value.routToSpeckSubtext,
            value.fieldSpeckSubtext,
            max,
            min,
            value.maxInput,
            value.minInput,
            value.unit,
            value.required
          )}
          label={
            (value.queryNameVariableLabel && value.fieldNameVariableLabel) ||
            value.indexVariableLabel
              ? variableLabel(
                  value.label,
                  documentDateContext.documentDate,
                  value.indexVariableLabel,
                  props.repeatStep,
                  value.queryNameVariableLabel,
                  value.fieldNameVariableLabel,
                  value.indexVariableLabel ? props.repeatStep : undefined
                )
              : value.label
          }
        />
      );
    }
  });
};
