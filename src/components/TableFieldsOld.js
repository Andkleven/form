import React, { useEffect, useContext, useState } from "react";
import Math from "./Math";
import VariableLabel from "./VariableLabel";
import { DocumentDateContext } from "./Document";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  useEffect(() => {
    setValue(
      props.math
        ? Math[props.math](
            documentDateContext.documentDate,
            props.listIndex,
            props.decimal ? props.decimal : 0
          )
        : props.state[props.name]
    );
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
  }, [
    props.math,
    documentDateContext.documentDate,
    props.listIndex,
    props.decimal,
    props.state[props.name]
  ]);
  return (
    <div className="text-center" key={props.index.toString()}>
      <small>
        {" "}
        <strong>{label + ": "}</strong>
        {value === undefined && props.setValueByIndex
          ? props.listIndex + 1
          : null}
        {value}
        {value === false && "✖"}
        {value === true && "✅"}
        {props.type === "file" && props.file && props.file.split("/")[1]}
      </small>
    </div>
  );
};
