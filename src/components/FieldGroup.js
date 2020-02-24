import React, { useEffect, useContext } from "react";
import ReadField from "./ReadField";
import WriteFieldGroupError from "./WriteFieldGroupError";
import { DocumentDateContext, FieldsContext } from "./DocumentAndSubmit";
import Line from "./Line";
import { getSubtext } from "./Function";
import VariableLabel from "./VariableLabel";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const fieldsContext = useContext(FieldsContext);

  useEffect(() => {
    if (
      documentDateContext.documentDate[props.thisChapter][props.pageName] !==
        undefined &&
      documentDateContext.documentDate[props.thisChapter][props.pageName][
        props.listIndex
      ] !== undefined
    ) {
      documentDateContext.setDocumentDate(prevState => ({
        ...prevState,
        [props.thisChapter]: {
          ...prevState[props.thisChapter],
          [props.pageName]: {
            ...prevState[props.thisChapter][props.pageName],
            [props.listIndex]: {
              ...prevState[props.thisChapter][props.pageName][props.listIndex],
              ...props.state
            }
          }
        }
      }));
    }
  }, [props.state]);

  useEffect(() => {
    let saveInfo = {};
    saveInfo["step"] = props.repeat ? props.listIndex : undefined;
    saveInfo["foreignKey"] = props.foreignKey;
    saveInfo["id"] = props.id;
    documentDateContext.setDocumentDate(prevState => ({
      ...prevState,
      [props.thisChapter]: {
        ...prevState[props.thisChapter],
        [props.pageName]: {
          ...prevState[props.thisChapter][props.pageName],
          [props.listIndex]: {
            ...prevState[props.thisChapter][props.pageName][props.listIndex],
            saveInfo
          }
        }
      }
    }));
  }, [props.listIndex, props.foreignKey, props.id]);
  return props.fields.map((value, index) => {
    if (value.line) {
      return <Line key={`${props.indexId}-${index}`} />;
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
          subtext={getSubtext(
            value.subtext,
            value.max,
            value.min,
            value.maxInput,
            value.minInput,
            value.unit,
            value.required
          )}
          value={props.state[value.fieldName] ? props.state[value.fieldName] : ""}
          file={value.type === "file" ? props.file : null}
          indexId={`${props.indexId}-${index}`}
          index={index}
        />
      );
    } else {
      return (
        <ReadField
          key={`${props.indexId}-${index}`}
          indexId={`${props.indexId}-${index}`}
          index={index}
          value={props.state[value.fieldName]}
          label={
            (value.queryNameVariableLabel && value.fieldNameVariableLabel) ||
            value.indexVariableLabel
              ? VariableLabel(
                  value.label,
                  documentDateContext.documentDate,
                  value.indexVariableLabel,
                  props.listIndex,
                  value.queryNameVariableLabel,
                  value.fieldNameVariableLabel,
                  value.indexVariableLabel ? props.listIndex : undefined
                )
              : value.label
          }
        />
      );
    }
  });
};
