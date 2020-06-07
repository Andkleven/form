import React, { useContext, useCallback, useEffect, useState } from "react";
import { DocumentDateContext, ChapterContext } from "components/form/Form";
import objectPath from "object-path";
import Input from "components/input/Input";
import TinyButton from "components/button/TinyButton";
import LightLine from "components/design/LightLine";
import "styles/styles.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ignoreRequiredField, userField } from "config/const";
import { USER } from "constants.js";
import {isStringInstance} from "functions/general"

const decimalTooStep = {
  0: 0,
  1: 0.1,
  2: 0.01,
  3: 0.001,
  4: 0.0001,
  5: 0.00001,
  6: 0.000001,
  7: 0.0000001,
  8: 0.00000001,
  9: 0.000000001
};


export default ({setResetState, setState, ...props}) => {
  const userInfo = JSON.parse(localStorage.getItem(USER));
  const [ignoreRequired, setIgnoreRequired] = useState("")
  const { editChapter, setEditChapter } = useContext(ChapterContext);  
  const { documentDate, documentDateDispatch, func } = useContext(
    DocumentDateContext
    );
  const addUser = useCallback(() => {
    documentDateDispatch({
      type: "add",
      newState: userInfo.username,
      path: props.path + userField
    });
  }, [documentDateDispatch, props.path, userInfo.username]);

  const runFunc = useCallback(() => {
    Object.values(func).reverse().forEach(a => {
      a();
    });
  }, [func])

  const onChangeDate = data => {
    addUser();
    documentDateDispatch({ type: "add", newState: data, path: props.path });
    runFunc()
  };

  const onChangeSelect = e => {
    addUser();
    documentDateDispatch({ type: "add", newState: e.value, path: props.path });
    runFunc()
  };

  const onChange = e => {
    let { value, type } = e.target;
    addUser();
    let newValue = value
    if (["checkbox", "radio", "switch"].includes(type)) {
      newValue = !objectPath.get(documentDate, props.path, false);
    } else {
      if (type === "number") {
        newValue = Number(value);
        if (props.decimal) {
          newValue.toFixed(props.decimal);
        }
      }
    }
    documentDateDispatch({
      type: "add",
      newState: newValue,
      path: props.path
    });
    setState(newValue)
    runFunc()
  };

  const onChangeIgnoreRequired = e => {
    let { name } = e.target;
    addUser();
    let oldValue = objectPath.get(documentDate, props.path, false);
    setIgnoreRequired(oldValue)
    documentDateDispatch({
      type: "add",
      newState: !oldValue,
      path: props.path + name
    });
  };

  const cancelEdit = event => {
    event.persist();
    event.preventDefault();
    documentDateDispatch({
      type: "add",
      newState: objectPath.get(props.data, props.path),
      path: props.path
    });
    setEditChapter(0);
    setResetState(prevState => !prevState)
  };

  // const submitEdit = (event, data) => {
  //   event.persist();
  //   event.preventDefault();
  //   props.submitHandler(data);
  // };

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
          type="submit"
          // onClick={event => submitEdit(event, documentDate)}
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
              type="submit"
              // onClick={event => submitEdit(event, documentDate)}
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
  
  const defaultValue = useCallback(() => {
    return objectPath.get(
      props.backendData,
      props.path,
      props.default !== undefined ? props.default : ""
      );
    }, [props.backendData, props.path, props.default]);
    
    useEffect(() => {
      setIgnoreRequired(objectPath.get(
        documentDate,
        props.path + ignoreRequiredField,
        false
      ))
    }, [defaultValue, setIgnoreRequired, documentDate, props.path])
    
    useEffect(() => {
      documentDateDispatch({
        type: "add",
        newState: defaultValue(),
        path: props.path
      });
    }, [props.path, documentDateDispatch, defaultValue])
    
  return (
    <>
      <Input
        {...props}
        focus={isStringInstance(editChapter) ? true : null}
        onChangeDate={onChangeDate}
        defaultValue={defaultValue()}
        value={
          (props.type === "date" || props.type === "datetime-local") &&
          new Date(objectPath.get(documentDate, props.path, null)) 
        }
        onChange={onChange}
        onChangeSelect={onChangeSelect}
        label={props.label}
        TinyButtons={TinyButtons()}
        BigButtons={BigButtons()}
        name={props.fieldName}
        min={props.minInput ? props.minInput : undefined}
        max={props.maxInput ? props.maxInput : undefined}
        required={
          props.ignoreRequired && ignoreRequired ? false : props.required
        }
        step={props.decimal ? decimalTooStep[props.decimal] : 0}
        tight={props.submitButton}
      />
      {props.ignoreRequired && (
        <Input
          type={"checkbox"}
          onChange={onChangeIgnoreRequired}
          defaultValue={objectPath.get(
            documentDate,
            props.path + ignoreRequiredField,
            false
          )}
          label={`Ignore Required on ${props.label}`}
          TinyButtons={TinyButtons()}
          BigButtons={BigButtons()}
          name={ignoreRequiredField}
          tight={props.submitButton}
        />
      )}
      {props.submitButton ? <LightLine /> : null}
    </>
  );
};
