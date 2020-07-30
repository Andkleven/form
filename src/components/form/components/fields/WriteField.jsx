import React, { useContext, useCallback, useEffect, useState } from "react";
import { documentDataContext, ChapterContext } from "components/form/Form";
import objectPath from "object-path";
import Input from "components/input/Input";
import TinyButton from "components/button/TinyButton";
import LightLine from "components/design/LightLine";
import "styles/styles.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ignoreRequiredField, userField } from "config/const";
import { USER } from "constants.js";
import { isStringInstance } from "functions/general";

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

export default ({ setResetState, setState, state, ...props }) => {
  const userInfo = JSON.parse(localStorage.getItem(USER));
  const [ignoreRequired, setIgnoreRequired] = useState(false);
  const { editChapter, setEditChapter } = useContext(ChapterContext);
  const { documentData, documentDataDispatch } = useContext(
    documentDataContext
  );
  const addUser = useCallback(() => {
    documentDataDispatch({
      type: "add",
      newState: userInfo.username,
      path: props.path + userField
    });
  }, [documentDataDispatch, props.path, userInfo.username]);

  const onChangeDate = data => {
    addUser();
    documentDataDispatch({ type: "add", newState: data, path: props.path });
    setState(data);
  };

  const onChangeSelect = e => {
    addUser();
    documentDataDispatch({ type: "add", newState: e.value, path: props.path });
    setState(e.value);
  };

  const onChangeFile = value => {
    documentDataDispatch({
      type: "add",
      newState: value,
      path: props.path
    });
    setState(value);
  };

  const onChangeInput = e => {
    let { value, type } = e.target;
    addUser();
    let newValue = value;
    if (["checkbox", "radio", "switch"].includes(type)) {
      newValue = !objectPath.get(documentData.current, props.path, false);
    } else {
      if (type === "number") {
        if (value === "") {
          // newValue = undefined;
        } else {
          newValue = Number(value);
        }
        if (props.decimal && typeof newValue === "number") {
          newValue.toFixed(props.decimal);
        }
      }
    }
    documentDataDispatch({
      type: "add",
      newState: newValue,
      path: props.path
    });
    setState(newValue);
  };

  const onChangeIgnoreRequired = e => {
    let { name } = e.target;
    addUser();
    let oldValue = objectPath.get(documentData.current, props.path, false);
    setIgnoreRequired(!oldValue);
    documentDataDispatch({
      type: "add",
      newState: !oldValue,
      path: props.path + name
    });
  };

  const cancelEdit = event => {
    event.persist();
    event.preventDefault();
    documentDataDispatch({
      type: "add",
      newState: objectPath.get(props.data, props.path),
      path: props.path
    });
    setEditChapter(0);
    setResetState(prevState => !prevState);
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
          tooltip="Submit"
          className="text-success"
        >
          Submit
        </TinyButton>
        <TinyButton
          className="text-secondary"
          icon="times"
          onClick={event => cancelEdit(event)}
          tooltip="Cancel"
        >
          Cancel
        </TinyButton>
      </div>
    ) : null;
  };

  const BigButtons = () => {
    if (props.submitButton) {
      return (
        <>
          <div className={`d-flex d-${buttonBreakPoint}-none my-1`}>
            <Button
              className="w-100 m-0 px-0 text-light"
              variant="success"
              type="submit"
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
    setIgnoreRequired(
      objectPath.get(
        documentData.current,
        props.path + ignoreRequiredField,
        false
      )
    );
  }, [setIgnoreRequired, documentData, props.path]);

  useEffect(() => {
    let newSate;
    if (props.type === "date" || props.type === "datetime-local") {
      let backendDate = objectPath.get(props.backendData, props.path, null);
      newSate = backendDate ? new Date(backendDate) : null;
    } else {
      newSate = defaultValue();
    }
    setState(newSate);
    if (newSate) {
      documentDataDispatch({
        type: "add",
        newState: newSate,
        path: props.path
      });
    }
  }, [
    setState,
    props.path,
    documentDataDispatch,
    defaultValue,
    props.backendData,
    props.type
  ]);
  // console.log(documentData.current, props.backendData);
  const indent =
    (!props.label && props.prepend && props.indent !== false) || props.indent;

  // if (props.label === "Vulcanization Option") {
  //   console.log("label", props.label);
  //   console.log("prepend", props.prepend);
  //   console.log("indent", props.indent);
  //   console.log("indent", props.indent);
  // }
  return (
    <div className={indent && "ml-3"}>
      <Input
        {...props}
        focus={isStringInstance(editChapter) ? true : null}
        onChangeDate={onChangeDate}
        value={state === undefined ? "" : state}
        readOnly={props.readOnly}
        onChangeInput={onChangeInput}
        onChangeSelect={onChangeSelect}
        onChangeFile={onChangeFile}
        label={props.label}
        TinyButtons={TinyButtons()}
        BigButtons={BigButtons()}
        name={props.fieldName}
        required={ignoreRequired ? false : props.required}
        step={props.decimal ? decimalTooStep[props.decimal] : 0}
        tight={props.submitButton}
      />
      {props.ignoreRequired && (
        <Input
          type={"checkbox"}
          onChange={onChangeIgnoreRequired}
          value={ignoreRequired}
          label={`Ignore Required on ${props.label}`}
          TinyButtons={TinyButtons()}
          BigButtons={BigButtons()}
          name={ignoreRequiredField}
          tight={props.submitButton}
        />
      )}
      {props.submitButton ? <LightLine /> : null}
    </div>
  );
};
