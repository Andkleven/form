import React, { useEffect, useContext, useState } from "react";
import ReadField from "./ReadField";
import ReadOnlyField from "./ReadOnlyField";
import WriteField from "./WriteField";
import { DocumentDateContext } from "./DocumentAndSubmit";
import Line from "./Line";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const [editField, setEditField] = useState(undefined);
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
        [props.name]: {
          ...prevState[props.thisChapter][props.name],
          [props.listIndex]: {
            ...prevState[props.thisChapter][props.name][props.listIndex],
            saveInfo
          }
        }
      }
    }));
  }, [props.listIndex, props.foreignKey, props.id]);

  return props.fields.map((value, index) => {
    if (value.line) {
      return <Line 
      key={`${props.indexId}-${index}`}
      />;
    } else if (value.readOnly) {
      return (
        <ReadOnlyField
          {...value}
          {...props}
          name={props.name}
          fieldName={value.name}
          key={`${props.index}-${index}`}
          indexId={`${props.indexId}-${index}`}
        />
      );
    } else if (props.writeChapter || index === editField) {
      return (
        <WriteField
          {...value}
          {...props}
          key={`${props.indexId}-${index}`}
          value={props.state[value.name] ? props.state[value.name] : ""}
          file={value.type === "file" ? props.file : null}
          indexId={`${props.indexId}-${index}`}
          name={props.name}
          fieldName={value.name}
        />
      );
    } else {
      return (
        <ReadField
          {...value}
          {...props}
          setEditField={setEditField}
          index={index}
          name={props.name}
          fieldName={value.name}
          key={`${props.indexId}-${index}`}
          indexId={`${props.indexId}-${index}`}
        />
      );
    }
  });
};
