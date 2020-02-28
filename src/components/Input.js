import React from "react";
import {
  isMobile,
  // isTablet,
  isSafari,
  isChrome,
  isFirefox
} from "react-device-detect";

import Date from "./inputs/Date";
import Datetime from "./inputs/Datetime";
import NativeInput from "./inputs/NativeInput";
import CheckInput from "./inputs/CheckInput";
import SelectInput from "./inputs/SelectInput";
import FileInput from "./inputs/FileInput";

function Input(props) {
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
}

export default Input;
