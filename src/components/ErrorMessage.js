import React from "react";

const style = { fontSize: 12, color: "red" };

export default props => {
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
