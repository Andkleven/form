import React, { useState, useContext } from "react";
import ErrorMessage from "./ErrorMessage";
import {
  FieldsContext,
  DocumentDateContext,
  ChapterContext
} from "./DocumentAndSubmit";
import objectPath from "object-path";
import SubmitButton from "./SubmitButton";
import { allTrue } from "./Functions";
import Input from "components/Input";

import "../styles/styles.css";

export default props => {
  const fieldsContext = useContext(FieldsContext);
  const chapterContext = useContext(ChapterContext);
  const documentDateContext = useContext(DocumentDateContext);
  const [showMinMax, setShowMinMax] = useState(false); // if true show error message befor submit

  const onChangeDate = date => {
    documentDateContext.setDocumentDate(prevState => {
      objectPath.set(prevState, props.path, date);
      return { ...prevState };
    });
  };

  const onChange = e => {
    setShowMinMax(true);
    let { name, value, type, step, min, max } = e.target;
    min = Number(min);
    max = Number(max);
    if (
      (!max && !min) ||
      (max && Number(value) < max) ||
      (min && min < Number(value))
    ) {
      if (["checkbox", "radio", "switch"].includes(type)) {
        let oldValue = objectPath.get(
          documentDateContext.documentDate,
          props.path,
          false
        );
        documentDateContext.setDocumentDate(prevState => {
          objectPath.set(prevState, props.path, oldValue);
          return {
            ...prevState
          };
        });
      } else {
        if (type === "number") {
          let decimal = step
            ? props.fields.find(x => x.fieldName === name).decimal
            : 0;
          let numberValue = value;
          if (
            numberValue.split(".")[1] &&
            decimal < numberValue.split(".")[1].length
          ) {
            numberValue = props.state[name];
          }
          documentDateContext.setDocumentDate(prevState => {
            objectPath.set(prevState, props.path, numberValue);
            return {
              ...prevState
            };
          });
        } else {
          documentDateContext.setDocumentDate(prevState => {
            objectPath.set(prevState, props.path, value);
            return {
              ...prevState
            };
          });
        }
      }
    }
  };

  const handelBack = event => {
    event.persist();
    event.preventDefault();
    chapterContext.setEditChapter(0);
    fieldsContext.setvalidationPassed({});
  };

  const handelReRender = event => {
    event.persist();
    event.preventDefault();
    chapterContext.setEditChapter(0);
    props.submitHandler(documentDateContext.documentDate);
  };

  return (
    <>
      <Input
        {...props}
        onChangeDate={onChangeDate}
        onChange={onChange}
        name={props.fieldName}
        min={props.minInput ? props.minInput : undefined}
        max={props.maxInput ? props.maxInput : undefined}
        step={props.decimal ? "0.1" : "1"}
      />
      <ErrorMessage showMinMax={showMinMax} error={props.error} />
      {props.submitButton ? (
        <>
          <SubmitButton onClick={event => handelReRender(event)} />
          {fieldsContext.isSubmited && props.submitButton ? (
            <div style={{ fontSize: 12, color: "red" }}>See Error Message</div>
          ) : null}
          <button onClick={event => handelBack(event)}>Back</button>
        </>
      ) : null}
    </>
  );
};
