import React, { useEffect, useContext } from "react";
import ReadField from "./ReadOnlyField";
import WritePage from "./WritePage";
import { DocumentDateContext } from "./Document";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  useEffect(() => {
    if (
      documentDateContext.documentDate[props.thisChapter][props.name] !== undefined &&
      documentDateContext.documentDate[props.thisChapter][props.name][props.listIndex] !==
        undefined
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

  const onChange = e => {
    let { name, value, type, step, min, max } = e.target;
    min = Number(min);
    max = Number(max);
    if (
      (!max && !min) ||
      (max && Number(value) < max) ||
      (min && min < Number(value))
    ) {
      if (["checkbox", "radio", "switch"].includes(type)) {
        props.setState(prevState => ({
          ...prevState,
          [name]: !props.state[name]
        }));
      } else {
        if (type === "number") {
          let decimal = step
            ? props.json.find(x => x.name === name).decimal
            : 0;
          let numberValue = value;
          if (
            numberValue.split(".")[1] &&
            decimal < numberValue.split(".")[1].length
          ) {
            numberValue = props.state[name];
          }
          props.setState(prevState => ({
            ...prevState,
            [name]: numberValue
          }));
        } else {
          props.setState(prevState => ({ ...prevState, [name]: value }));
        }
      }
    }
  };
  useEffect(() => {
    let saveInfo = {};
    saveInfo["step"] = props.onePage ? undefined : props.listIndex;
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
  // console.log(documentDateContext.documentDate);
  // console.log(props.state);

  return props.json.map((value, index) => {
    if (value.readOnly) {
      return (
        <ReadField
          {...value}
          {...props}
          name={props.name}
          fieldName={value.name}
          key={`${props.index}-${index}`}
        />
      );
    } else {
      return (
        <WritePage
          {...value}
          {...props}
          key={`${props.index}-${index}`}
          value={props.state[value.name] ? props.state[value.name] : ""}
          file={value.type === "file" ? props.file : null}
          index={`${props.index}-${index}`}
          name={props.name}
          fieldName={value.name}
          onChange={onChange}
        />
      );
    }
  });
};
