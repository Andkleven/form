import React, { useState, useEffect, useContext } from "react";
import { Form } from "react-bootstrap";
import Table from "./Table";
import { DocumentDateContext } from "./DocumentAndSubmit";
import FieldGroup from "./FieldGroup";
import Title from "./Title";

import "../styles/styles.css";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const [state, setState] = useState({});
  const [id, setId] = useState(0);
  if (
    !documentDateContext.documentDate[props.thisChapter][props.name] ||
    !documentDateContext.documentDate[props.thisChapter][props.name][
      props.listIndex
    ]
  ) {
    let updateValues = {};
    if (!documentDateContext.documentDate[props.thisChapter][props.name]) {
      updateValues = { [props.listIndex]: {} };
    } else if (
      !documentDateContext.documentDate[props.thisChapter][props.name][
        props.listIndex
      ]
    ) {
      updateValues = {
        ...documentDateContext.documentDate[props.thisChapter][props.name],
        [props.listIndex]: {}
      };
    }
    documentDateContext.setDocumentDate(prevState => ({
      ...prevState,
      [props.thisChapter]: {
        ...prevState[props.thisChapter],
        [props.name]: {
          ...updateValues
        }
      }
    }));
  }

  useEffect(() => {
    if (props.fields) {
      props.fields.map(value => {
        if (value.type === "file") {
          return null;
        }
        return setState(prevState => ({
          ...prevState,
          [value.name]:
            value.default !== undefined
              ? value.default
              : ["checkbox", "radio", "switch"].includes(value.type)
              ? false
              : value.select === "select"
              ? value.options[0]
              : ""
        }));
      });
    }
    const setStateWithData = data => {
      setId(data.id);
      if (data.data && data.data.trim() !== "") {
        let inputData = JSON.parse(data.data.replace(/'/g, '"'));
        props.fields.map(value => {
          if (value.type === "file") {
            return null;
          }
          return setState(prevState => ({
            ...prevState,
            [value.name]: inputData[value.name]
          }));
        });
      }
    };
    if (!props.data || props.data.length === 0) {
      setId(0);
    } else {
      if (Array.isArray(props.data)) {
        setStateWithData(
          props.createWithValueLast
            ? props.data[props.data.length - 1]
            : props.data[0]
        );
      } else {
        setStateWithData(props.data);
      }
    }
    if (props.createWithOldValue) {
      setId(0);
    }
  }, [props.data, props.writeChapter]);

  if (props.writeChapter !== undefined) {
    return (
      <>
        {!props.stopLoop ? (
          <Title
            key={`${props.thisChapter}-${props.index}-jja`}
            title={props.fieldGroupRepeatTitle}
          />
        ) : null}
        {props.fields && (
          <Form key={`${props.queryPath}-form-${props.index}`}>
            {props.writeChapter ? (
              <FieldGroup
                {...props}
                key={props.index}
                state={state}
                setState={setState}
                id={id}
                file={props.data && props.data.file}
              />
            ) : (
              <Table
                {...props}
                state={state}
                setState={setState}
                key={props.index}
                file={props.data && props.data.file}
              />
            )}
          </Form>
        )}
      </>
    );
  } else {
    return null;
  }
};