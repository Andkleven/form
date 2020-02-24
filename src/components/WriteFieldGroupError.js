import React, { useState, useEffect, useContext } from "react";
import VariableLabel from "./VariableLabel";
import { DocumentDateContext, FieldsContext } from "./DocumentAndSubmit";
import ReadOnlyField from "./ReadOnlyField";
import WriteField from "./WriteField";

// import Datetime from "react-datetime";
// import "react-datetime/css/react-datetime.css";

import "../styles/styles.css";

const initialState = {
  min: "",
  max: "",
  required: ""
};

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const fieldsContext = useContext(FieldsContext);
  const [label, setLabel] = useState("");
  const [error, setError] = useState(initialState);

  useEffect(() => {
    setLabel(
      (props.queryNameVariableLabel && props.fieldNameVariableLabel) ||
        props.indexVariableLabel
        ? VariableLabel(
            props.label,
            documentDateContext.documentDate,
            props.indexVariableLabel,
            props.repeatStep,
            props.queryNameVariableLabel,
            props.fieldNameVariableLabel,
            props.indexVariableLabel ? props.repeatStep : undefined
          )
        : props.label
    );
  }, [documentDateContext.documentDate]);

  // set error message if outside criteria
  useEffect(() => {
    if (
      fieldsContext.editField ||
      (!fieldsContext.editField && props.writeChapter)
    ) {
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
      fieldsContext.setvalidationPassed(prevState => ({
        ...prevState,
        [props.indexId]: passedValidation
      }));
    } else {
      setError(initialState);
    }
  }, [props.value, props.writeChapter, fieldsContext.editField]);

  if (props.readOnly) {
    return (
      <ReadOnlyField
        {...props}
        key={props.indexId}
        label={label}
        error={error}
      />
    );
  } else {
    return <WriteField {...props} label={label} error={error} />;
  }
};
