import React from "react";

export default props => {
  return props.children ? <h5>{props.children}</h5> : null;
};
