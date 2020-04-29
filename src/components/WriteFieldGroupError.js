import React, { useState, useEffect, useContext } from "react";
import { FieldsContext, ChapterContext } from "./DocumentAndSubmit";
import ReadOnlyField from "./ReadOnlyField";
import WriteField from "./WriteField";

// import Datetime from "react-datetime";
// import "react-datetime/css/react-datetime.css";

import "../styles/styles.css";

const initialState = {
  min: "",
  max: "",
  required: "",
};

export default (props) => {
  const fieldsContext = useContext(FieldsContext);
  const chapterContext = useContext(ChapterContext);
  const [error, setError] = useState(initialState);

  // set error message if outside criteria
  useEffect(() => {
    if (
      chapterContext.editChapter ===
        `${props.repeatStepList}-${props.fieldName}` ||
      props.writeChapter
    ) {
      let passedValidation = true;
      if (props.required) {
        let testValue = JSON.stringify(props.value);
        if (!testValue.trim() || !props.value) {
          setError((prevState) => ({
            ...prevState,
            required: "You forgot this field",
          }));
          passedValidation = false;
        } else {
          setError((prevState) => ({
            ...prevState,
            required: "",
          }));
        }
      }
      let min = props.min ? props.min : 0;
      if (props.value < min) {
        setError((prevState) => ({
          ...prevState,
          min: `Too small, ${props.label} have to be bigger than ${min}`,
        }));
        passedValidation = false;
      } else {
        setError((prevState) => ({
          ...prevState,
          min: "",
        }));
      }
      if (props.max) {
        if (props.value > props.max) {
          setError((prevState) => ({
            ...prevState,
            max: `Too big, ${props.label} have to be smaller than ${props.max}`,
          }));
          passedValidation = false;
        } else {
          setError((prevState) => ({
            ...prevState,
            max: "",
          }));
        }
      }
      fieldsContext.setValidationPassed((prevState) => ({
        ...prevState,
        [`${props.repeatStepList}-${props.fieldName}`]: passedValidation,
      }));
    } else {
      setError(initialState);
    }
  }, [props.value, props.writeChapter, fieldsContext.editField]);
  if (props.math || props.setValueByIndex) {
    return <ReadOnlyField {...props} label={props.label} error={error} />;
  } else {
    return <WriteField {...props} label={props.label} error={error} />;
  }
};
