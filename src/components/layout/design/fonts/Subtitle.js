import React from "react";

export default props => {
  return props.children ? (
    <h4 style={{ fontWeight: 400 }} className="mb-1">
      {props.children}
    </h4>
  ) : null;
};
