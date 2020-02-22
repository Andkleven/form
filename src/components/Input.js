import React, { useState, useEffect, useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";
import ErrorMessage from "./ErrorMessage";
import FilesUpload from "./FilesUpload";
import VariableLabel from "./VariableLabel";
import { ValuesContext } from "../page/canvas";

// import Datetime from "react-datetime";
// import "react-datetime/css/react-datetime.css";

import "../styles/styles.css";

import Date from "./inputs/Date";
import Datetime from "./inputs/Datetime";

export default props => {
  const valuesContext = useContext(ValuesContext);
  const [label, setLabel] = useState("");
  const [error, setError] = useState({
    min: "",
    max: "",
    required: ""
  });
  useEffect(() => {
    setLabel(
      props.queryNameVariableLabel && props.fieldNameVariableLabel
        ? VariableLabel(
            props.label,
            valuesContext.values,
            props.indexVariableLabel,
            props.listIndex,
            props.queryNameVariableLabel,
            props.fieldNameVariableLabel
          )
        : props.label
    );
  }, [valuesContext.values]);

  useEffect(() => {
    let passedValidation = true;
    if (props.required) {
      let testValue = JSON.stringify(props.value);
      if (!testValue.trim() || !props.value) {
        setError(prevState => ({
          ...prevState,
          required: "You forgot this field"
        }));
        passedValidation = false;
      } else {
        setError(prevState => ({
          ...prevState,
          required: ""
        }));
      }
    }
    let min = props.min ? props.min : 0;
    if (props.value < min) {
      setError(prevState => ({
        ...prevState,
        min: `Too small, ${label} have to be bigger than ${min}`
      }));
      passedValidation = false;
    } else {
      setError(prevState => ({
        ...prevState,
        min: ""
      }));
    }
    if (props.max) {
      if (props.value > props.max) {
        setError(prevState => ({
          ...prevState,
          max: `Too big, ${label} have to be smaller than ${props.max}`
        }));
        passedValidation = false;
      } else {
        setError(prevState => ({
          ...prevState,
          max: ""
        }));
      }
    }
    props.setvalidationPassed(prevState => ({
      ...prevState,
      [props.index]: passedValidation
    }));
  }, [props.value]);

  if (["checkbox", "radio", "switch"].includes(props.type)) {
    return (
      <>
        <Form.Group>
          <Form.Check
            custom
            type={props.type}
            name={props.fieldName}
            value={props.value}
            onChange={props.onChange}
            id={`custom-${props.type}-${props.fieldName}-${props.index}`}
            label={label}
          />
          <Form.Text className="text-muted">{props.subtext}</Form.Text>
          <ErrorMessage error={error} isSubmited={props.isSubmited} />
        </Form.Group>
      </>
    );
  } else if (props.type === "dateCustom") {
    return <Date {...props} />;
  } else if (props.type === "datetimeCustom") {
    return <Datetime {...props} />;
  } else if (props.type === "file") {
    return (
      <FilesUpload
        {...props}
        key={`custom-${props.type}-${props.fieldName}-${props.index}`}
        name={props.fieldName}
      />
    );
  } else {
    return (
      <>
        <Form.Group>
          <Form.Label>{label}</Form.Label>
          <InputGroup>
            {props.prepend && (
              <InputGroup.Prepend>
                <InputGroup.Text>{props.prepend}</InputGroup.Text>
              </InputGroup.Prepend>
            )}

            <Form.Control
              required={false}
              value={props.value}
              id={`custom-${props.type}-${props.fieldName}-${props.index}`}
              name={props.fieldName}
              onChange={props.onChange}
              as={props.select}
              type={props.type}
              min={props.minInput ? props.minInput : undefined}
              max={props.maxInput ? props.maxInput : undefined}
              step={props.decimal ? "0.1" : "1"}
              placeholder={props.placeholder}
            >
              {props.options
                ? props.options.map((option, index) => {
                    return <option key={index}>{option}</option>;
                  })
                : null}
            </Form.Control>

            {props.unit && (
              <InputGroup.Append>
                <InputGroup.Text className="">{props.unit}</InputGroup.Text>
              </InputGroup.Append>
            )}
          </InputGroup>
          <Form.Text className="text-muted">{props.subtext}</Form.Text>
          <Form.Control.Feedback type="invalid">
            {props.feedback}
          </Form.Control.Feedback>
          <ErrorMessage error={error} isSubmited={props.isSubmited} />
        </Form.Group>
      </>
    );
  }
};
