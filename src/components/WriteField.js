import React, { useState, useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";
import ErrorMessage from "./ErrorMessage";
import FilesUpload from "./FilesUpload";
import { FieldsContext, DocumentDateContext } from "./DocumentAndSubmit";
import SubmitButton from "./SubmitButton";
import { allTrue } from "./Functions";
import Input from "components/Input";

import "../styles/styles.css";

export default props => {
  const fieldsContext = useContext(FieldsContext);
  const documentDateContext = useContext(DocumentDateContext);
  const [showMinMax, setShowMinMax] = useState(false); // if true show error message befor submit

  const onChangeDate = (name, date) => {
    props.setState(prevState => ({
      ...prevState,
      [name]: date
    }));
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
        descriptionId: props.descriptionId,
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
          <SubmitButton
            onClick={event => submitHandler(event, props.thisChapter)}
          />
          {fieldsContext.isSubmited && props.submitButton ? (
            <div style={{ fontSize: 12, color: "red" }}>See Error Message</div>
          ) : null}
          <button onClick={event => handelBack(event)}>Back</button>
        </>
      ) : null}
    </>
  );
};
