import React from "react";
import {
  isMobile,
  // isTablet,
  isSafari,
  isChrome,
  isFirefox
} from "react-device-detect";
import { Form } from "react-bootstrap";

import Date from "./inputs/Date";
import Datetime from "./inputs/Datetime";
import NativeInput from "./inputs/NativeInput";
import CheckInput from "./inputs/CheckInput";
import SelectInput from "./inputs/SelectInput";
import FileInput from "./inputs/FileInput";

const customLabelTypes = ["checkbox", "radio", "switch"];

const InputShell = props => {
  const BottomPart = props => {
    return <>{props.BigButtons}</>;
  };

  return !customLabelTypes.includes(props.type) ? (
    <>
      <div className="d-flex justify-content-between">
        {props.label && <Form.Label>{props.label}</Form.Label>}
        {props.TinyButtons}
      </div>
      {props.children}
      <BottomPart {...props} />
    </>
  ) : (
    <>
      {props.children}
      <BottomPart {...props} />
    </>
  );
};

const InputType = props => {
  const isDateRelated = ["date", "datetime-local"].includes(props.type);
  const hasBadCalendar = [isSafari, isChrome, isFirefox].includes(true);
  const isDesktop = !isMobile;
  const useCustomDate = isDateRelated & hasBadCalendar & isDesktop;

  if (["checkbox", "radio", "switch"].includes(props.type)) {
    return <CheckInput {...props} />;
  } else if (useCustomDate) {
    if (props.type === "date") {
      return <Date {...props} />;
    } else if (props.type === "datetime-local") {
      return <Datetime {...props} />;
    }
  } else if (props.type === "select") {
    return <SelectInput {...props} />;
  } else if (props.type === "file") {
    return <FileInput {...props} />;
  } else {
    return <NativeInput {...props} />;
  }
};

export default props => (
  <InputShell {...props}>
    <InputType {...props} />
  </InputShell>
);
