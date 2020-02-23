import React from "react";

import "../styles/styles.css";

export default props => {
  return (
    <div className="text-center">
      <small>
        {" "}
        <strong>{props.label + ": "}</strong>
        {props.value}
        {props.value === false && "✖"}
        {props.value === true && "✅"}
      </small>
    </div>
  );
};