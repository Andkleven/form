import React from "react";
import {
  isMobile,
  // isTablet,
  isSafari,
  isChrome,
  isFirefox
} from "react-device-detect";
import { Form } from "react-bootstrap";

import Date from "components/input/components/Date";
import Datetime from "components/input/components/Datetime";
import NativeInput from "components/input/components/NativeInput";
import CheckInput from "components/input/components/CheckInput";
import SelectInput from "components/input/components/SelectInput";
import FileInput from "components/input/components/FileInput";
import Duplicate from "components/input/widgets/Duplicate";

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
    {/* {props.repeat && props.repeatStartWithOneGroup && <Duplicate {...props} />} */}
  </InputShell>
);
