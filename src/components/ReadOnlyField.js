import React, { useContext, useEffect, useState } from "react";
import { DocumentDateContext } from "./DocumentAndSubmit";
import Math from "./Math";
import VariableLabel from "./VariableLabel";
import ReadField from "./ReadField";

import "../styles/styles.css";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    let temporaryValue = props.setValueByIndex
      ? props.listIndex + 1
      : props.math
      ? Math[props.math](
          documentDateContext.documentDate,
          props.listIndex,
          props.decimal ? props.decimal : 0
        )
      : props.state[props.fieldName];
    setLabel(
      props.queryNameVariableLabel && props.fieldNameVariableLabel
        ? VariableLabel(
            props.label,
            documentDateContext.documentDate,
            props.indexVariableLabel,
            props.listIndex,
            props.queryNameVariableLabel,
            props.fieldNameVariableLabel
          )
        : props.label
    );
    if (temporaryValue !== props.state[props.fieldName]) {
      setValue(temporaryValue);
      props.setState(prevState => ({
        ...prevState,
        [props.fieldName]: temporaryValue
      }));
    }
  }, [documentDateContext.documentDate]);

  return <ReadField key={props.index} value={value} label={label} />;
};
