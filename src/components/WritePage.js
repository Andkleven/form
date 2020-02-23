import React, { useState, useEffect, useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";
import ErrorMessage from "./ErrorMessage";
import FilesUpload from "./FilesUpload";
import VariableLabel from "./VariableLabel";
import { DocumentDateContext } from "./DocumentAndSubmit";

// import Datetime from "react-datetime";
// import "react-datetime/css/react-datetime.css";

import "../styles/styles.css";

import Date from "./inputs/Date";
import Datetime from "./inputs/Datetime";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const [showMinMax, setShowMinMax] = useState(false);
  const [label, setLabel] = useState("");
  const [error, setError] = useState({
    min: "",
    max: "",
    required: ""
  });
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
        props.setState(prevState => ({
          ...prevState,
          [name]: !props.state[name]
        }));
      } else {
        if (type === "number") {
          let decimal = step
            ? props.fields.find(x => x.name === name).decimal
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
    setLabel(
      props.queryNameVariableLabel && props.fieldNameVariableLabel
        ? VariableLabel(
            props.label,
            documentDateContext.documentDate,
            props.indexVariableLabel,
            props.listIndex,
            props.queryNameVariableLabel,
            props.fieldNameVariableLabel
          )
        : props.label
    );
  }, [documentDateContext.documentDate]);

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
      [props.indexId]: passedValidation
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
            onChange={onChange}
            id={`custom-${props.type}-${props.fieldName}-${props.indexId}`}
            label={label}
          />
          <Form.Text className="text-muted">{props.subtext}</Form.Text>
          <ErrorMessage
            showMinMax={showMinMax}
            error={error}
            isSubmited={props.isSubmited}
          />
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
        key={`custom-${props.type}-${props.fieldName}-${props.indexId}`}
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
              id={`custom-${props.type}-${props.fieldName}-${props.indexId}`}
              name={props.fieldName}
              onChange={onChange}
              as={props.select}
              type={props.type}
              min={props.minInput ? props.minInput : undefined}
              max={props.maxInput ? props.maxInput : undefined}
              step={props.decimal ? "0.1" : "1"}
              placeholder={props.placeholder}
            >
              {props.options
                ? props.options.map((option, indexId) => {
                    return <option key={indexId}>{option}</option>;
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
          <ErrorMessage
            showMinMax={showMinMax}
            error={error}
            isSubmited={props.isSubmited}
          />
        </Form.Group>
      </>
    );
  }
};
