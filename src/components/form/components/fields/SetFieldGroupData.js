import React, { useState, useEffect, useContext } from "react";
import objectPath from "object-path";
import { DocumentDateContext } from "components/form/Form";
import FieldGroup from "components/form/components/fields/FieldGroup";
import Title from "components/design/fonts/Title";
import { variableString, emptyObject, emptyField } from "functions/general";

import "styles/styles.css";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const [trigger, setTrigger] = useState(false);
  const [newPath, setNewPath] = useState(null);
  const [state, setState] = useState();

  // sets default data or data from database to every field in group and store it in state
  useEffect(() => {
    if (props.fields) {
      props.fields.map(value => {
        if (
          value.type === "file" ||
          value.line ||
          value.page ||
          value.specValueList
        ) {
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
      if (data && data.data && !emptyObject(data.data)) {
        props.fields.map(value => {
          if (
            value.type === "file" ||
            value.line ||
            value.page ||
            value.specValueList
          ) {
            return null;
          }
          if (["date", "datetime-local"].includes(value.type)) {
            return setState(pervState => ({
              ...pervState,
              [value.fieldName]: emptyField(data.data[value.fieldName])
                ? null
                : new Date(data.data[value.fieldName])
            }));
          }
          return setState(pervState => ({
            ...pervState,
            [value.fieldName]: data.data[value.fieldName]
          }));
        });
      }
    };
    if (props.data) {
      if (Array.isArray(props.data)) {
        setStateWithData(
          props.createWithValueLast
            ? props.data[props.data.length - 1]
            : props.data[0]
        );
      } else {
        setStateWithData(props.data);
      }
      setTrigger(!trigger);
    }
  }, [props.data, props.writeChapter]);

  useEffect(() => {
    if (props.data && props.path) {
      documentDateContext.setDocumentDate(prevState => {
        objectPath.set(prevState, props.path ? props.path + ".data" : "data", {
          ...objectPath.get(
            prevState,
            props.path ? props.path + ".data" : "data"
          ),
          ...state
        });
        return {
          ...prevState
        };
      });
    }
  }, [trigger]);

  if (props.writeChapter !== undefined) {
    return (
      <>
        {!props.stopLoop && (
          <Title
            key={`${props.thisChapter}-${props.index}-jja`}
            title={
              props.indexVariableFieldGroupRepeatTitle
                ? variableString(
                    props.repeatStep + 1,
                    props.fieldGroupRepeatTitle
                  )
                : props.fieldGroupRepeatTitle
            }
          />
        )}
        {props.fields && (
          <FieldGroup
            {...props}
            key={props.index}
            path={newPath ? props.path + newPath : props.path}
            // state={state}
            // setState={setState}
            file={props.data && props.data.file}
          />
        )}
      </>
    );
  } else {
    return null;
  }
};
