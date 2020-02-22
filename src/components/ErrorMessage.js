import React from "react";

const ErrorMessage = props => {
  return (
    <>
      <div style={{ fontSize: 12, color: "red" }}>{props.error["min"]}</div>
      <div style={{ fontSize: 12, color: "red" }}>{props.error["max"]}</div>
      {props.isSubmited && !props.error["min"] && !props.error["max"] ? (
        <div style={{ fontSize: 12, color: "red" }}>
          {props.error["required"]}
        </div>
      ) : null}
    </>
  );
};

export default ErrorMessage;
