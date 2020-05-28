import React, { useState, useContext, useCallback, useEffect } from "react";
import ErrorMessage from "../ErrorMessage";
import {
  FieldsContext,
  DocumentDateContext,
  ChapterContext
} from "components/form/Form";
import objectPath from "object-path";
import Input from "components/input/Input";
import TinyButton from "components/button/TinyButton";
import LightLine from "components/design/LightLine";
import "styles/styles.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ignoreRequiredField, userField } from "config/const";
import { USER } from "constants.js";

let initialValue = {
  min: "",
  max: "",
  required: ""
};

export default props => {
  const userInfo = JSON.parse(localStorage.getItem(USER));
  const {editChapter, setEditChapter} = useContext(ChapterContext);
  const {documentDate, documentDateDispatch} = useContext(DocumentDateContext);
  const [showMinMax, setShowMinMax] = useState(false); // if true show error message before submit
  const {setValidationPassed} = useContext(FieldsContext);
  const [error, setError] = useState(initialValue)
  
  const addUser = useCallback(() => {
      documentDateDispatch({type: 'add', newState: userInfo.username, path: props.path + userField})
    },[documentDateDispatch, props.path, userInfo.username])
  
  
  const testPassedValidation = useCallback(data => {
    if (
      editChapter ===
        `${props.path}-${props.fieldName}` ||
      props.writeChapter
    ) {
      let passedValidation = true;
      if (props.required) {
        if (!data) {
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
      if (data < min) {
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
        if (data > props.max) {
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
      props.max,
      props.min,
      props.label,
      props.required,
      props.writeChapter
    ])



    useEffect(() => {
      testPassedValidation(objectPath.get(props.backendData, props.path, null))
    }, [testPassedValidation, props.backendData, props.path])
  
  const onChangeDate = data => {
    addUser()
    setShowMinMax(true);
    testPassedValidation(data)
    documentDateDispatch({type: 'add', newState: data, path: props.path})
  };
 
  const onChangeSelect = e => {
    addUser()
    setShowMinMax(true);
    testPassedValidation(e.value)
    documentDateDispatch({type: 'add', newState: e.value, path: props.path})
  };
  
  const onBlur = e => {
    let { name, value, type, step, min, max } = e.target;
    addUser()
    setShowMinMax(true);
    testPassedValidation(value)
    min = Number(min);
    max = Number(max);
    if (
      (!max && !min) ||
      (max && Number(value) < max) ||
      (min && min < Number(value))
    ) {
      if (["checkbox", "radio", "switch"].includes(type)) {
        let oldValue = objectPath.get(
          documentDate,
          props.path,
          false
        );
        documentDateDispatch({type: 'add', newState: !oldValue, path: props.path})
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
          documentDateDispatch({type: 'add', newState: numberValue, path: props.path})
  } else {
          documentDateDispatch({type: 'add', newState: value, path: props.path})
  }
      }
    }
  };
  const onBlurIgnoreRequired = e => {
    let { name } = e.target;
    addUser()
    setShowMinMax(false)
    setError(initialValue)
    setValidationPassed(prevState => ({
      ...prevState,
      [`${props.path}-${props.fieldName}`]: true
    }));
    let oldValue = objectPath.get(
          documentDate,
          props.path,
          false
        );
    documentDateDispatch({type: 'add', newState: !oldValue, path: props.path+name})
  };

  const cancelEdit = event => {
    event.persist();
    event.preventDefault();
    documentDateDispatch({type: 'add', newState: objectPath.get(props.data, props.path), path: props.path})
    setEditChapter(0);
    setValidationPassed({});
  };

  const submitEdit = (event, data) => {
    event.persist();
    event.preventDefault();
    props.submitHandler(data);
  };

  const buttonBreakPoint = "sm";

  const TinyButtons = () => {
    return props.submitButton ? (
      <div
        className={`d-none d-${buttonBreakPoint}-inline ${
          !props.label && " w-100 text-right"
        }`}
      >
        <TinyButton
          icon="check"
          onClick={event => submitEdit(event, documentDate)}
          tooltip="Submit"
        />
        <TinyButton
          icon="times"
          onClick={event => cancelEdit(event)}
          tooltip="Cancel"
          // color="secondary"
        />
      </div>
    ) : null;
  };

  const BigButtons = () => {
    if (props.submitButton) {
      return (
        <>
          <div className={`d-flex d-${buttonBreakPoint}-none mb-1`}>
            <Button
              className="w-100 m-0 px-0 text-light"
              variant="primary"
              onClick={event =>
                submitEdit(event, documentDate)
              }
            >
              <FontAwesomeIcon icon="check" style={{ width: "1.5em" }} />
              Submit
            </Button>
            <div className="px-1" />
            <Button
              className="w-100 m-0 px-0"
              variant="secondary"
              onClick={event => cancelEdit(event)}
            >
              <FontAwesomeIcon icon="times" style={{ width: "1.5em" }} />
              Cancel
            </Button>
          </div>
        </>
      );
    }
  };

  const defaultValue =  useCallback(() => {
    return objectPath.get(props.backendData, props.path, props.default !== undefined ? props.default : "")
  }, [
    props.backendData,
    props.path,
    props.default
  ])

  return (
    <>
      <Input
        {...props}
        onChangeDate={onChangeDate}
        defaultValue={defaultValue()}
        value={(props.type === "date" || props.type === "datetime-local") && new Date(objectPath.get(
                documentDate,
                props.path,
                null
              ))}
        onBlur={onBlur}
        onChangeSelect={onChangeSelect}
        label={props.label}
        TinyButtons={TinyButtons()}
        BigButtons={BigButtons()}
        name={props.fieldName}
        min={props.minInput ? props.minInput : undefined}
        max={props.maxInput ? props.maxInput : undefined}
        step={props.decimal ? "0.1" : "1"}
        tight={props.submitButton}
      />
      {props.ignoreRequired && <Input
        type={"checkbox"}
        onBlur={onBlurIgnoreRequired}
        defaultValue={objectPath.get(
          documentDate,
          props.path+ignoreRequiredField,
          false
        )}
        label={`Ignore Required on ${props.label}`}
        TinyButtons={TinyButtons()}
        BigButtons={BigButtons()}
        name={ignoreRequiredField}
        tight={props.submitButton}
      />}
      <ErrorMessage showMinMax={showMinMax} error={error} />
      {props.submitButton ? <LightLine /> : null}
    </>
  );
};
