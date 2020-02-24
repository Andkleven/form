import React, { useState, useEffect, useContext } from "react";
import { Form } from "react-bootstrap";
import { DocumentDateContext } from "./DocumentAndSubmit";
import FieldGroup from "./FieldGroup";
import Title from "./Title";
import VariableLabel from "./VariableLabel";

import "../styles/styles.css";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const [state, setState] = useState({}); // Data for this group
  const [id, setId] = useState(0); // Id for this group

  // set page name and which group number you are on to documentDate
  if (
    !documentDateContext.documentDate[props.thisChapter][props.pageName] ||
    !documentDateContext.documentDate[props.thisChapter][props.pageName][
      props.repeatStep
    ]
  ) {
    let updateValues = {};
    if (!documentDateContext.documentDate[props.thisChapter][props.pageName]) {
      updateValues = { [props.repeatStep]: {} };
    } else if (
      !documentDateContext.documentDate[props.thisChapter][props.pageName][
        props.repeatStep
      ]
    ) {
      updateValues = {
        ...documentDateContext.documentDate[props.thisChapter][props.pageName],
        [props.repeatStep]: {}
      };
    }
    documentDateContext.setDocumentDate(prevState => ({
      ...prevState,
      [props.thisChapter]: {
        ...prevState[props.thisChapter],
        [props.pageName]: {
          ...updateValues
        }
      }
    }));
  }
  // sets default data or data from database to every field in group and store it in state
  useEffect(() => {
    if (props.fields) {
      props.fields.map(value => {
        if (value.type === "file" || value.line) {
          return null;
        }
        return setState(prevState => ({
          ...prevState,
          [value.fieldName]:
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
          if (value.type === "file" || value.line) {
            return null;
          }
          return setState(prevState => ({
            ...prevState,
            [value.fieldName]: inputData[value.fieldName]
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
            title={
              props.indexVariableFieldGroupRepeatTitle
                ? VariableLabel(
                    props.fieldGroupRepeatTitle,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    props.repeatStep + 1
                  )
                : props.fieldGroupRepeatTitle
            }
          />
        ) : null}
        {props.fields && (
          <Form key={props.indexId}>
            {
              <FieldGroup
                {...props}
                key={props.index}
                state={state}
                setState={setState}
                id={id}
                file={props.data && props.data.file}
              />
            }
          </Form>
        )}
      </>
    );
  } else {
    return null;
  }
};
