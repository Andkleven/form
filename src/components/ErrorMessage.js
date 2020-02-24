import React, { useState, useEffect, useContext } from "react";
import { FieldsContext } from "./DocumentAndSubmit";

export default props => {
  const fieldsContext = useContext(FieldsContext);

  const [style, setStyle] = useState({ fontSize: 12, color: "red" });
  useEffect(() => {
    setStyle(prevState => ({
      ...prevState,
      color: props.showMinMax ? "orange" : fieldsContext.isSubmited ? "red" : ""
    }));
  }, [props.showMinMax, fieldsContext.isSubmited]);
  return (
    <>
      {(props.showMinMax || fieldsContext.isSubmited) && (
        <div style={style}>{props.error["min"]}</div>
      )}
      {(props.showMinMax || fieldsContext.isSubmited) && (
        <div style={style}>{props.error["max"]}</div>
      )}
      {fieldsContext.isSubmited &&
      !props.error["min"] &&
      !props.error["max"] ? (
        <div style={style}>{props.error["required"]}</div>
      ) : null}
    </>
  );
};
