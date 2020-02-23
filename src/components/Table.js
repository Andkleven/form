import React, { useEffect, useContext } from "react";
import Math from "./Math";
import VariableLabel from "./VariableLabel";
import { DocumentDateContext } from "./DocumentAndSubmit";
import ReadField from "./ReadField";

import "../styles/styles.css";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);

  useEffect(() => {
    if (
      documentDateContext.documentDate[props.thisChapter][props.name] !==
        undefined &&
      documentDateContext.documentDate[props.thisChapter][props.name][
        props.listIndex
      ] !== undefined
    ) {
      documentDateContext.setDocumentDate(prevState => ({
        ...prevState,
        [props.thisChapter]: {
          ...prevState[props.thisChapter],
          [props.name]: {
            ...prevState[props.thisChapter][props.name],
            [props.listIndex]: {
              ...prevState[props.thisChapter][props.name][props.listIndex],
              ...props.state
            }
          }
        }
      }));
    }
  }, [
    props.state,
    props.valuesDefined,
    props.thisChapter,
    props.name,
    props.listIndex
  ]);

  const tabel = props.fields.map((value, index) => {
    return (
      <ReadField
        label={
          value.queryNameVariableLabel && value.fieldNameVariableLabel
            ? VariableLabel(
                value.label,
                documentDateContext.documentDate,
                value.indexVariableLabel,
                props.listIndex,
                value.queryNameVariableLabel,
                value.fieldNameVariableLabel
              )
            : value.label
        }
        value={
          value.setValueByIndex
            ? props.listIndex + 1
            : value.math
            ? Math[value.math](
                documentDateContext.documentDate,
                props.listIndex,
                value.decimal ? value.decimal : 0
              )
            : props.state[value.name]
        }
        key={`${props.index}-${index}`}
        index={index}
      />
    );
  });
  return <>{tabel}</>;
};
