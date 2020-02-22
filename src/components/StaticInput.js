import React, { useContext, useEffect, useState } from "react";
import { ValuesContext } from "./Book";
import Math from "./Math";
import VariableLabel from "./VariableLabel";

import "../styles/styles.css";

export default props => {
  const valuesContext = useContext(ValuesContext);
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    let temporaryValue = props.setValueByIndex
      ? props.listIndex + 1
      : props.math
      ? Math[props.math](
          valuesContext.values,
          props.listIndex,
          props.decimal ? props.decimal : 0
        )
      : props.state[props.fieldName];
    setLabel(
      props.queryNameVariableLabel && props.fieldNameVariableLabel
        ? VariableLabel(
            props.label,
            valuesContext.values,
            props.indexVariableLabel,
            props.listIndex,
            props.queryNameVariableLabel,
            props.fieldNameVariableLabel
          )
        : props.label
    );
    console.log(temporaryValue, props.state[props.fieldName]);
    if (temporaryValue !== props.state[props.fieldName]) {
      console.log(props.fieldName);
      setValue(temporaryValue);
      props.setState(prevState => ({
        ...prevState,
        [props.fieldName]: temporaryValue
      }));
    }
  }, [valuesContext.values]);

  return (
    <div className="text-center">
      <small>
        {" "}
        <strong>{label + ": "}</strong>
        {value}
        {value === false && "✖"}
        {value === true && "✅"}
      </small>
    </div>
  );
};

