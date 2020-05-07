import React, { useState, useContext } from "react";
import ErrorMessage from "../ErrorMessage";
import {
  FieldsContext,
  DocumentDateContext,
  ChapterContext
} from "components/form/Form";
import objectPath from "object-path";
import Input from "components/input/Input";
import TinyButton from "components/button/TinyButton";
import LightLine from "components/layout/design/LightLine";
import "styles/styles.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default props => {
  const fieldsContext = useContext(FieldsContext);
  const chapterContext = useContext(ChapterContext);
  const documentDateContext = useContext(DocumentDateContext);
  const [showMinMax, setShowMinMax] = useState(false); // if true show error message before submit

  const onChangeDate = date => {
    documentDateContext.setDocumentDate(prevState => {
      objectPath.set(prevState, props.path, date);
      return { ...prevState };
    });
  };
  const onChangeSelect = e => {
    documentDateContext.setDocumentDate(prevState => {
      objectPath.set(prevState, props.path, e.value);
      return {
        ...prevState
      };
    });
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
        // console.log(value);
        let oldValue = objectPath.get(
          documentDateContext.documentDate,
          props.path,
          false
        );
        // console.log(oldValue);
        documentDateContext.setDocumentDate(prevState => {
          objectPath.set(prevState, props.path, !oldValue);
          return {
            ...prevState
          };
        });
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
          documentDateContext.setDocumentDate(prevState => {
            objectPath.set(prevState, props.path, numberValue);
            return {
              ...prevState
            };
          });
        } else {
          documentDateContext.setDocumentDate(prevState => {
            objectPath.set(prevState, props.path, value);
            return {
              ...prevState
            };
          });
        }
      }
    }
  };

  const cancelEdit = event => {
    event.persist();
    event.preventDefault();
    documentDateContext.setDocumentDate(prevState => {
      objectPath.set(prevState, props.path, props.data.data[props.fieldName]);
      return { ...prevState };
    });
    chapterContext.setEditChapter(0);
    fieldsContext.setValidationPassed({});
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
          onClick={event => submitEdit(event, documentDateContext.documentDate)}
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
                submitEdit(event, documentDateContext.documentDate)
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

  return (
    <>
      <Input
        {...props}
        onChangeDate={onChangeDate}
        onChange={onChange}
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
      <ErrorMessage showMinMax={showMinMax} error={props.error} />
      {props.submitButton ? <LightLine /> : null}
    </>
  );
};
