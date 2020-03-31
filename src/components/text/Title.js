import React from "react";

export default props => {
  return props.children ? <h4>{props.children}</h4> : null;
};
