import React, { useContext, useEffect, useMemo, useState } from "react";
import { DocumentDateContext, ChapterContext, FieldsContext } from "components/form/Form";
import Math from "components/form/functions/math";
import objectPath from "object-path";
import ReadField from "components/form/components/fields/ReadField";

import "styles/styles.css";
let initialValue = {
  min: "",
  max: "",
  required: ""
};

export default props => {
  const {documentDate, documentDateDispatch} = useContext(DocumentDateContext);
  const {setValidationPassed} = useContext(FieldsContext);
  const {editChapter} = useContext(ChapterContext);
  const [error, setError] = useState(initialValue)
  
  useEffect(() => {
    if (
      editChapter ===
        `${props.path}-${props.fieldName}` ||
      props.writeChapter
    ) {
      let passedValidation = true;
      if (props.required) {
        let testValue = JSON.stringify(props.value);
        if (!testValue || !testValue.trim() || !props.value) {
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
          min: `Too small, ${props.label} have to be bigger than ${min}`
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
            max: `Too big, ${props.label} have to be smaller than ${props.max}`
          }));
          passedValidation = false;
        } else {
          setError(prevState => ({
            ...prevState,
            max: ""
          }));
        }
      }
        setValidationPassed(prevState => ({
          ...prevState,
          [`${props.path}-${props.fieldName}`]: passedValidation
        }));
      }
    }, [
    setValidationPassed,
    props.fieldName,
    props.path,
    editChapter,
    props.value,
    props.max,
    props.min,
    props.label,
    props.required,
    props.writeChapter
  ])

  const temporaryValue = useMemo(() => props.setValueByIndex
  ? props.repeatStep + 1
  : Math[props.math](
    documentDate,
    props.repeatStepList,
    props.decimal ? props.decimal : 0
    ), [
      props.setValueByIndex,
      props.repeatStep,
      documentDate,
      props.repeatStepList,
      props.decimal,
      props.math
    ])

  // Test if value shall update when documentDate update
  useEffect(() => {
    documentDateDispatch({type: 'add', newState: temporaryValue, path: props.path})
  }, [temporaryValue, documentDateDispatch, props.path]);

  return (
    <ReadField
      {...props}
      key={props.indexId}
      error={error}
      readOnly={true}
      value={objectPath.get(documentDate, props.path)}
      showMinMax={temporaryValue !== null ? true : false}
    />
  );
};
