import React, { useState, useEffect, useContext } from "react";
import objectPath from "object-path";
import { Form } from "react-bootstrap";
import { DocumentDateContext } from "./DocumentAndSubmit";
import FieldGroup from "./FieldGroup";
import Title from "./Title";
import { variableLabel, emptyObject } from "components/Functions";

import "../styles/styles.css";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  // const [state, setState] = useState({}); // Data for this group
  const [id, setId] = useState(0); // Id for this group

  // set page name and which group number you are on to documentDate
  // useEffect(() => {
  //   if (
  //     !documentDateContext.documentDate[props.thisChapter][props.pageName] ||
  //     !documentDateContext.documentDate[props.thisChapter][props.pageName][
  //       props.repeatStep
  //     ]
  //   ) {
  //     let updateValues = {};
  //     if (
  //       !documentDateContext.documentDate[props.thisChapter][props.pageName]
  //     ) {
  //       updateValues = { [props.repeatStep]: {} };
  //     } else if (
  //       !documentDateContext.documentDate[props.thisChapter][props.pageName][
  //         props.repeatStep
  //       ]
  //     ) {
  //       updateValues = {
  //         ...documentDateContext.documentDate[props.thisChapter][
  //           props.pageName
  //         ],
  //         [props.repeatStep]: {}
  //       };
  //     }
  //     documentDateContext.setDocumentDate(prevState => ({
  //       ...prevState,
  //       [props.thisChapter]: {
  //         ...prevState[props.thisChapter],
  //         [props.pageName]: {
  //           ...updateValues
  //         }
  //       }
  //     }));
  //   }
  // }, [
  //   documentDateContext.documentDate[props.thisChapter],
  //   documentDateContext.documentDate[props.thisChapter][props.pageName],
  //   props.data
  // ]);
  // sets default data or data from database to every field in group and store it in state
  useEffect(() => {
    let testData = {};
    if (props.fields) {
      props.fields.map(value => {
        if (value.type === "file" || value.line || value.routToSpeckValue) {
          return null;
        }
        return (testData = {
          ...testData,
          [value.fieldName]:
            value.default !== undefined
              ? value.default
              : ["checkbox", "radio", "switch"].includes(value.type)
              ? false
              : value.select === "select"
              ? value.options[0]
              : ["date", "datetime-local"].includes(value.type)
              ? new Date()
              : ""
        });
      });
    }
    const setStateWithData = data => {
      setId(data.id);
      if (data.data && !emptyObject(data.data)) {
        props.fields.map(value => {
          if (value.type === "file" || value.line || value.routToSpeckValue) {
            return null;
          }
          if (["date", "datetime-local"].includes(value.type)) {
            return (testData = {
              ...testData,
              [value.fieldName]: [undefined, null, ""].includes(
                data.data[value.fieldName]
              )
                ? null
                : new Date(data.data[value.fieldName])
            });
          }
          return (testData = {
            ...testData,
            [value.fieldName]: data.data[value.fieldName]
          });
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

    documentDateContext.setDocumentDate(prevState => ({
      // ...prevState,
      ...objectPath.set(prevState, props.path + ".data", testData)
    }));
  }, [props.data, props.writeChapter]);

  console.log(documentDateContext.documentDate);
  if (props.writeChapter !== undefined) {
    return (
      <>
        {!props.stopLoop ? (
          <Title
            key={`${props.thisChapter}-${props.index}-jja`}
            title={
              props.indexVariableFieldGroupRepeatTitle
                ? variableLabel(
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
                path={props.path}
                // state={state}
                // setState={setState}
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
