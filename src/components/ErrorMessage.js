import React, { useState, useEffect } from "react";

export default props => {
  const [style, setStyle] = useState({ fontSize: 12, color: "red" });
  useEffect(() => {
    setStyle(prevState => ({
      ...prevState,
      color: props.showMinMax ? "orange" : props.isSubmited ? "red" : ""
    }));
  }, [props.showMinMax, props.isSubmited]);
  return (
    <>
      {(props.showMinMax || props.isSubmited) && (
        <div style={style}>{props.error["min"]}</div>
      )}
      {(props.showMinMax || props.isSubmited) && (
        <div style={style}>{props.error["max"]}</div>
      )}
      {props.isSubmited && !props.error["min"] && !props.error["max"] ? (
        <div style={style}>{props.error["required"]}</div>
      ) : null}
    </>
  );
};
