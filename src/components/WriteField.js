import React, { useState, useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";
import ErrorMessage from "./ErrorMessage";
import FilesUpload from "./FilesUpload";
import { FieldsContext, DocumentDateContext } from "./DocumentAndSubmit";
import SubmitButton from "./SubmitButton";
import { allTrue } from "./Function";

import "../styles/styles.css";

import Date from "./inputs/Date";
import Datetime from "./inputs/Datetime";

export default props => {
  const fieldsContext = useContext(FieldsContext);
  const documentDateContext = useContext(DocumentDateContext);
  const [showMinMax, setShowMinMax] = useState(false); // if true show error message befor submit

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
            ? props.fields.find(x => x.fieldName === name).decimal
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
  const prepareDataForSubmit = (variables, key, dictionary) => {
    Object.keys(dictionary).forEach(value => {
      let saveInfo = dictionary[value]["saveInfo"];
      delete dictionary[value]["saveInfo"];
      if (key === "uploadFile") {
        variables[key].push({
          ...saveInfo,
          data: JSON.stringify(dictionary[value])
        });
      } else {
        variables[key].push({
          ...saveInfo,
          data: JSON.stringify(dictionary[value])
        });
      }
    });
  };

  const submitData = data => {
    // let files;
    // if (data["files"]) {
    //   files = data["files"];
    //   delete data["files"];
    // }
    let variables = {};
    Object.keys(data).forEach(key => {
      variables[key] = [];
      prepareDataForSubmit(variables, key, data[key]);
    });
    props.mutation({
      variables: {
        ...variables,
        categoryId: props.categoryId,
        itemId: props.itemId
      }
    });
  };

  const submitHandler = (event, thisChapter) => {
    event.persist();
    event.preventDefault();

    if (Object.values(fieldsContext.validationPassed).every(allTrue)) {
      submitData(documentDateContext.documentDate[thisChapter]);
      fieldsContext.setIsSubmited(false);
      fieldsContext.setvalidationPassed({});
      fieldsContext.setEditField("");
    } else {
      fieldsContext.setIsSubmited(true);
    }
  };

  const handelBack = event => {
    event.persist();
    event.preventDefault();
    fieldsContext.setEditField("");
    fieldsContext.setvalidationPassed({});
  };
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
            label={props.label}
          />
          {props.subtext ? (
            <Form.Text className="text-muted">{props.subtext}</Form.Text>
          ) : null}
          <ErrorMessage showMinMax={showMinMax} error={props.error} />
          {props.submitButton ? (
            <>
              <SubmitButton
                onClick={event => submitHandler(event, props.thisChapter)}
              />
              {fieldsContext.isSubmited && props.submitButton ? (
                <div style={{ fontSize: 12, color: "red" }}>
                  See Error Message
                </div>
              ) : null}
              <button onClick={event => handelBack(event)}>Back</button>
            </>
          ) : null}
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
          {props.notLabel ? null : <Form.Label>{props.label}</Form.Label>}
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
          {props.subtext ? (
            <Form.Text className="text-muted">{props.subtext}</Form.Text>
          ) : null}
          <Form.Control.Feedback type="invalid">
            {props.feedback}
          </Form.Control.Feedback>
          <ErrorMessage showMinMax={showMinMax} error={props.error} />
          {props.submitButton ? (
            <>
              <SubmitButton
                onClick={event => submitHandler(event, props.thisChapter)}
              />
              {fieldsContext.isSubmited && props.submitButton ? (
                <div style={{ fontSize: 12, color: "red" }}>
                  See Error Message
                </div>
              ) : null}
              <button onClick={event => handelBack(event)}>Back</button>
            </>
          ) : null}
        </Form.Group>
      </>
    );
  }
};
