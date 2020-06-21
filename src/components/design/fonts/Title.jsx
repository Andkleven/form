import React from "react";

export default ({ big, children }) => {
  if (big) {
    return children ? <h1 className="mb-1">{children}</h1> : null;
  }
  return children ? <h3 className="mb-1">{children}</h3> : null;
};
