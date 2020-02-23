import React, { useState, useEffect, useContext } from "react";
import { Form } from "react-bootstrap";
import Table from "./Table";
import { ChapterContext, DocumentDateContext } from "./Document";
import FieldGroup from "./FieldGroup";

import "../styles/styles.css";

export default (props) => {
  const chapterContext = useContext(ChapterContext);
  const documentDateContext = useContext(DocumentDateContext);
  const [state, setState] = useState({});
  const [form, setForm] = useState(undefined);
  const [id, setId] = useState(0);
  if (
    !documentDateContext.documentDate[props.thisChapter][props.name] ||
    !documentDateContext.documentDate[props.thisChapter][props.name][props.listIndex]
  ) {
    let updateValues = {};
    if (!documentDateContext.documentDate[props.thisChapter][props.name]) {
      updateValues = { [props.listIndex]: {} };
    } else if (
      !documentDateContext.documentDate[props.thisChapter][props.name][props.listIndex]
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
    if (props.json) {
      props.json.map(value => {
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
        props.json.map(value => {
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
  }, [props.data, form]);

  useEffect(() => {
    if (props.allWaysShow) {
      setForm(true);
    } else if (chapterContext.chapter) {
      if (props.thisChapter === chapterContext.chapter) {
        setForm(true);
      } else {
        setForm(false);
      }
    } else if (props.thisChapter === chapterContext.lastChapter) {
      setForm(true);
    } else {
      setForm(false);
    }
  }, [
    props.thisChapter,
    props.allWaysShow,
    chapterContext.chapter,
    chapterContext.lastChapter
  ]);

  if (form !== undefined) {
    return (
      <>
        {props.showEidtButton && !props.stopLoop && !form ? (
          <>
            <br />
            <br />
            <br />
            <button
              onClick={() => {
                chapterContext.setChapter(props.thisChapter);
                props.setvalidationPassed({});
              }}
              key={chapterContext.lastChapter}
            >
              Edit
            </button>
          </>
        ) : null}
        {props.title && (form || (id && !form)) ? (
          <>
            <br />
            <br />
            <h1 className="text-center">{props.title}</h1>
            <hr className="w-100 mt-0 mb-1 p-0" />
          </>
        ) : null}
        {props.json && (
          <Form key={`${props.queryPath}-form-${props.index}`}>
            {form ? (
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
}

