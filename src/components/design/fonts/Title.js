import React from "react";

export default props => {
  return props.children ? <h3 className="mb-1">{props.children}</h3> : null;
};
