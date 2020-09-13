import React, { useContext, useCallback, useEffect, useState } from "react";
import { DocumentDataContext, ChapterContext } from "components/form/Form";
import objectPath from "object-path";
import Input from "components/input/Input";
import TinyButton from "components/button/TinyButton";
import LightLine from "components/design/LightLine";
import CheckInput from "components/input/components/CheckInput";
import "styles/styles.css";
import { Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ignoreRequiredField, userField } from "config/const";
import { USER } from "constants.js";
import { isStringInstance, isNumber, getSpecComment } from "functions/general";
import { dialog } from "components/Dialog";
const cloneDeep = require("clone-deep");

export default ({ setState, state, ...props }) => {
  const userInfo = JSON.parse(localStorage.getItem(USER));
  const [ignoreRequired, setIgnoreRequired] = useState(false);
  const { editChapter, setEditChapter } = useContext(ChapterContext);
  // const timer = useRef(0)
  const { documentData, documentDataDispatch, screenshotData } = useContext(
    DocumentDataContext
  );

  // console.log(documentData.current);

  const addUser = useCallback(() => {
    documentDataDispatch({
      type: "add",
      newState: userInfo.username,
      path: props.path + userField
    });
  }, [documentDataDispatch, props.path, userInfo.username]);

  const onChange = value => {
    if (!screenshotData.current) {
      screenshotData.current = cloneDeep(documentData.current);
    }
    addUser();
    documentDataDispatch({ type: "add", newState: value, path: props.path });
    setState(value);
  };

  const onChangeDate = data => {
    onChange(data);
  };

  const onChangeSelect = e => {
    onChange(e.value);
  };

  const onChangeFile = value => {
    documentDataDispatch({ type: "add", newState: value, path: props.path });
    setState(value);
    let spiltPath = props.path.split(".");
    documentDataDispatch({
      type: "add",
      newState: userInfo.username,
      path: `${spiltPath.slice(0, -1).join(".")}.data.${
        spiltPath[spiltPath.length - 1]
      }userField`
    });
  };

  const onChangeInput = e => {
    let { value, type } = e.target;
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
        if (isNumber(props.minInput)) {
          if (newValue < props.minInput) {
            newValue = props.minInput;
          }
        }
        if (props.maxInput) {
          if (props.maxInput < newValue) {
            newValue = props.maxInput;
          }
        }
        if (props.decimal && typeof newValue === "number") {
          newValue.toFixed(props.decimal);
        }
      }
    }
    onChange(newValue);
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
    setState(objectPath.get(props.backendData, props.path));
    documentDataDispatch({
      type: "add",
      newState: objectPath.get(props.backendData, props.path),
      path: props.path
    });
    setEditChapter(0);
  };

  // const submitEdit = (event, data) => {
  //   event.persist();
  //   event.preventDefault();
  //   props.submitHandler(data);
  // };

  const TinyButtons = () => {
    return props.submitButton ? (
      <div
        className={`d-none d-sm-inline ${!props.label && " w-100 text-right"}`}
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
          onClick={event => {
            if (
              screenshotData.current &&
              JSON.stringify(screenshotData.current) !==
                JSON.stringify(documentData.current)
            ) {
              dialog({
                message: "Do you want to save your changes?",
                buttons: [
                  {
                    label: "Save and continue",
                    variant: "success",
                    type: "submit",
                    onClick: () => {
                      props.submitData(documentData.current, false);
                      setEditChapter(0);
                    }
                  },
                  {
                    label: "Discard and continue",
                    variant: "danger",
                    onClick: () => {
                      cancelEdit(event);
                    }
                  }
                ]
              });
            } else {
              cancelEdit(event);
            }
          }}
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
          <div className={`d-flex d-sm-none my-1`}>
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

  useEffect(() => {
    setIgnoreRequired(
      objectPath.get(
        documentData.current,
        props.path + ignoreRequiredField,
        false
      )
    );
  }, [setIgnoreRequired, documentData, props.path]);

  const indent =
    (!props.label && props.prepend && props.indent !== false) || props.indent;

  // if (props.label === "Vulcanization Option") {
  //   console.log("label", props.label);
  //   console.log("prepend", props.prepend);
  //   console.log("indent", props.indent);
  //   console.log("indent", props.indent);
  // }
  // if (props.ignoreMin === undefined) {
  //   console.log(props.min);
  // }
  // console.log(props.ignoreMin === undefined ? props.min : undefined);

  const leComment = getSpecComment(
    props.specData,
    props.routeToSpecMax,
    props.routeToSpecMin,
    props.specValueList,
    props.repeatStepList,
    props.editRepeatStepValueList
  );

  const breakpoint = "sm";

  const showUnderBreakpoint = () => {
    return `d-inline d-${breakpoint}-none`;
  };

  const showAboveBreakpoint = () => {
    return `d-none d-${breakpoint}-inline`;
  };

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
        required={ignoreRequired ? undefined : props.required}
        step={
          !!props.decimal && Math.pow(0.1, props.decimal).toFixed(props.decimal)
        }
        tight={props.submitButton}
        documentData={documentData}
        documentDataDispatch={documentDataDispatch}
      />
      {props.ignoreRequired && (
        <CheckInput
          onChangeInput={onChangeIgnoreRequired}
          value={ignoreRequired}
          label={`Ignore Required on ${props.label}`}
          TinyButtons={TinyButtons()}
          BigButtons={BigButtons()}
          name={ignoreRequiredField}
          tight={props.submitButton}
        />
      )}
      {props.submitButton ? <LightLine /> : null}

      {!!leComment && (
        <Row className="mb-3 mt-n3">
          {/* Large */}
          <Col xs="12" sm="6" className={showAboveBreakpoint()}>
            <div className="text-muted">Comment from Lead Engineer</div>
          </Col>
          <Col xs="12" sm="6" className={showAboveBreakpoint()}>
            <div className="text-muted">"{leComment}"</div>
          </Col>
          {/* Small */}
          <Col xs="12" className={`${showUnderBreakpoint()}`}>
            <div className="d-flex justify-content-between align-items-center text-muted">
              <div>
                <small>Comment from Lead Engineer</small>
                <div>"{leComment}"</div>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};
