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
// import Duplicate from "components/input/widgets/Duplicate";
import { control } from "./functions/control.ts";

const customLabelTypes = ["checkbox", "radio", "switch"];

const InputShell = ({ ...props }) => {
  const BottomPart = props => {
    return <>{props.BigButtons}</>;
  };

  return !customLabelTypes.includes(props.type) ? (
    <div className={props.className} style={props.style}>
      <div className={props.tight ? "mb-0" : "mb-3"}>
        <div className="d-flex justify-content-between">
          {(props.label || props.prepend) && (
            <label
              htmlFor={`custom-${props.type}-${props.label}-${props.repeatStepList}`}
              hidden={!!props.prepend && !props.label}
            >
              {props.label}
            </label>
          )}
          {props.TinyButtons}
        </div>
        {props.children}
        <BottomPart {...props} />
      </div>
    </div>
  ) : (
    <div>
      <div className={props.tight ? "mb-0" : "mb-3"}>
        {props.children}
        <BottomPart {...props} />
      </div>
    </div>
  );
};

const InputType = props => {
  const isDateRelated = ["date", "datetime-local"].includes(props.type);
  const hasBadCalendar = [isSafari, isChrome, isFirefox].includes(true);
  const isDesktop = !isMobile;
  const useCustomDate = isDateRelated & hasBadCalendar & isDesktop;
  const readOnly = props.readOnlyFields ? props.readOnlyFields : props.readOnly;
  const disabled = readOnly;
  if (["checkbox", "radio", "switch"].includes(props.type)) {
    return <CheckInput {...props} />;
  } else if (useCustomDate) {
    if (props.type === "date") {
      return <Date {...props} />;
    } else if (props.type === "datetime-local") {
      return <Datetime {...props} readOnly={readOnly} />;
    }
  } else if (props.type === "select") {
    return <SelectInput {...props} disabled={disabled} />;
  } else if (props.type === "file") {
    return <FileInput {...props} readOnly={readOnly} />;
  } else {
    return <NativeInput {...props} readOnly={readOnly} />;
  }
};

export default ({ ...props }) => {
  const [valid, feedback] = control(props);

  return (
    <InputShell {...props} className={props.className} style={props.style}>
      <InputType
        {...props}
        isValid={valid}
        isInvalid={[true, false].includes(valid) && !valid}
      />
      {!!feedback && (
        <div className={`text-${valid ? "success" : "danger"}`}>
          <small>{feedback}</small>
        </div>
      )}
    </InputShell>
  );
};
