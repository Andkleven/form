import React, { useState, useEffect, useContext } from "react";
import { FieldsContext } from "components/form/Form";

export default props => {
  const fieldsContext = useContext(FieldsContext);

  const [style, setStyle] = useState({ fontSize: 12, color: "red" });
  useEffect(() => {
    setStyle(prevState => ({
      ...prevState,
      color: fieldsContext.isSubmitted ? "red" : "orange"
    }));
  }, [props.showMinMax, fieldsContext.isSubmitted]);
  return (
    <>
      {(props.showMinMax || fieldsContext.isSubmitted) && (
        <div style={style}>{props.error["min"]}</div>
      )}
      {(props.showMinMax || fieldsContext.isSubmitted) && (
        <div style={style}>{props.error["max"]}</div>
      )}
      {fieldsContext.isSubmitted &&
      !props.error["min"] &&
      !props.error["max"] ? (
        <div style={style}>{props.error["required"]}</div>
      ) : null}
    </>
  );
};
