import React from "react";

export default ({ small = false, className, ...props }) => {
  if (props.children) {
    if (small) {
      return <h6 className={`mb-1 ${className}`}>{props.children}</h6>;
    } else {
      return (
        <h4 style={{ fontWeight: 400 }} className={`mb-1 ${className}`}>
          {props.children}
        </h4>
      );
    }
  } else {
    return null;
  }
};
