import React, { useContext, useCallback } from "react";
import ReadField from "./ReadField";
import WriteFieldGroupError from "./WriteFieldGroupError";
import objectPath from "object-path";
import { DocumentDateContext, FieldsContext } from "./DocumentAndSubmit";
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

  // set state to documentDate
  // useEffect(() => {
  //   if (
  //     documentDateContext.documentDate[props.thisChapter][props.pageName] !==
  //       undefined &&
  //     documentDateContext.documentDate[props.thisChapter][props.pageName][
  //       props.repeatStep
  //     ] !== undefined
  //   ) {
  //     documentDateContext.setDocumentDate(prevState => ({
  //       ...prevState,
  //       [props.thisChapter]: {
  //         ...prevState[props.thisChapter],
  //         [props.pageName]: {
  //           ...prevState[props.thisChapter][props.pageName],
  //           [props.repeatStep]: {
  //             ...prevState[props.thisChapter][props.pageName][props.repeatStep],
  //             ...props.state
  //           }
  //         }
  //       }
  //     }));
  //   }
  // }, [props.state]);

  // set information about saveing to documentDate
  // useEffect(() => {
  //   let saveInfo = {};
  //   saveInfo["step"] = props.repeat ? props.repeatStep : undefined;
  //   saveInfo["foreignKey"] = props.foreignKey;
  //   saveInfo["id"] = props.id;
  //   documentDateContext.setDocumentDate(prevState => ({
  //     ...prevState,
  //     [props.thisChapter]: {
  //       ...prevState[props.thisChapter],
  //       [props.pageName]: {
  //         ...prevState[props.thisChapter][props.pageName],
  //         [props.repeatStep]: {
  //           ...prevState[props.thisChapter][props.pageName][props.repeatStep],
  //           saveInfo
  //         }
  //       }
  //     }
  //   }));
  // }, [
  //   props.repeat,
  //   props.repeatStep,
  //   props.foreignKey,
  //   props.id,
  //   fieldsContext.editField,
  //   chapterContext.editChapter
  // ]);
  const getNewPath = useCallback(
    fieldName => {
      return `${props.path}.data.${fieldName}`;
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
    } else if (field.routToSpeckValue && field.fieldSpeckValue) {
      return (
        <ReadField
          {...props}
          {...field}
          key={`${props.indexId}-${index}`}
          path={getNewPath(field.fieldName)}
          subtext={getSubtext(
            field.subtext,
            props.speckData,
            field.routToSpeckSubtext,
            field.fieldSpeckSubtext,
            max,
            min,
            field.maxInput,
            field.minInput,
            field.unit,
            field.required
          )}
          value={getDataFromQuery(
            props.speckData,
            field.routToSpeckValue,
            field.fieldSpeckValue
          )}
        />
      );
    } else if (
      field.readOnly ||
      props.writeChapter ||
      `${props.indexId}-${index}` === fieldsContext.editField
    ) {
      return (
        <WriteFieldGroupError
          {...field}
          {...props}
          key={`${props.indexId}-${index}`}
          path={getNewPath(field.fieldName)}
          submitButton={
            `${props.indexId}-${index}` === fieldsContext.editField
              ? true
              : false
          }
          min={min}
          max={max}
          subtext={getSubtext(
            field.subtext,
            props.speckData,
            field.routToSpeckSubtext,
            field.fieldSpeckSubtext,
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
            props.speckData,
            field.routToSpeckSubtext,
            field.fieldSpeckSubtext,
            max,
            min,
            field.maxInput,
            field.minInput,
            field.unit,
            field.required
          )}
          label={
            (field.queryNameVariableLabel && field.fieldNameVariableLabel) ||
            field.indexVariableLabel
              ? variableLabel(
                  field.label,
                  documentDateContext.documentDate,
                  field.indexVariableLabel,
                  props.repeatStep,
                  field.queryNameVariableLabel,
                  field.fieldNameVariableLabel,
                  field.indexVariableLabel ? props.repeatStep : undefined
                )
              : field.label
          }
        />
      );
    }
  });
};
