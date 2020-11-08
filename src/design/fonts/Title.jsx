import React from "react";

export default ({ big, children, align }) => {
  if (big) {
    return children ? (
      <h1 className="mb-1" align={align}>
        {children}
      </h1>
    ) : null;
  }
  return children ? (
    <h3 className="mb-1" align={align}>
      {children}
    </h3>
  ) : null;
};
