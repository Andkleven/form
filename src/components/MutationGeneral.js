import React, { useState, useEffect, useContext } from "react";
import { Form } from "react-bootstrap";
import Table from "./Table";
import { GruppContext, ValuesContext } from "./Book";
import FormInput from "./FormInput";

import "../styles/styles.css";

export default (props) => {
  const gruppContext = useContext(GruppContext);
  const valuesContext = useContext(ValuesContext);
  const [state, setState] = useState({});
  const [form, setForm] = useState(undefined);
  const [id, setId] = useState(0);
  if (
    !valuesContext.values[props.count][props.name] ||
    !valuesContext.values[props.count][props.name][props.listIndex]
  ) {
    let updateValues = {};
    if (!valuesContext.values[props.count][props.name]) {
      updateValues = { [props.listIndex]: {} };
    } else if (
      !valuesContext.values[props.count][props.name][props.listIndex]
    ) {
      updateValues = {
        ...valuesContext.values[props.count][props.name],
        [props.listIndex]: {}
      };
    }
    valuesContext.setValues(prevState => ({
      ...prevState,
      [props.count]: {
        ...prevState[props.count],
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
    } else if (gruppContext.gruppState) {
      if (props.count === gruppContext.gruppState) {
        setForm(true);
      } else {
        setForm(false);
      }
    } else if (props.count === gruppContext.grupp) {
      setForm(true);
    } else {
      setForm(false);
    }
  }, [
    props.count,
    props.allWaysShow,
    gruppContext.gruppState,
    gruppContext.grupp
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
                gruppContext.setGruppState(props.count);
                props.setvalidationPassed({});
              }}
              key={gruppContext.grupp}
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
              <FormInput
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

