import React, { useContext, useCallback } from "react";
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

export default props => {
  const userInfo = JSON.parse(localStorage.getItem(USER));
  const { setEditChapter } = useContext(ChapterContext);
  const { documentDate, documentDateDispatch } = useContext(
    DocumentDateContext
  );
  const addUser = useCallback(() => {
    documentDateDispatch({
      type: "add",
      newState: userInfo.username,
      path: props.path + userField
    });
  }, [documentDateDispatch, props.path, userInfo.username]);

  const onChangeDate = data => {
    addUser();
    documentDateDispatch({ type: "add", newState: data, path: props.path });
  };

  const onChangeSelect = e => {
    addUser();
    documentDateDispatch({ type: "add", newState: e.value, path: props.path });
  };

  const onChange = e => {
    let { value, type } = e.target;
    addUser();
    if (["checkbox", "radio", "switch"].includes(type)) {
      let oldValue = objectPath.get(documentDate, props.path, false);
      documentDateDispatch({
        type: "add",
        newState: !oldValue,
        path: props.path
      });
    } else {
      if (type === "number") {
        let numberValue = Number(value);
        if (props.decimal) {
          numberValue.toFixed(props.decimal);
        }
        documentDateDispatch({
          type: "add",
          newState: numberValue,
          path: props.path
        });
      } else {
        documentDateDispatch({
          type: "add",
          newState: value,
          path: props.path
        });
      }
    }
  };

  const onChangeIgnoreRequired = e => {
    let { name } = e.target;
    addUser();
    let oldValue = objectPath.get(documentDate, props.path, false);
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

  return (
    <>
      <Input
        {...props}
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
          props.ignoreRequired &&
          objectPath.get(documentDate, props.path + ignoreRequiredField, false)
            ? false
            : props.required
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
