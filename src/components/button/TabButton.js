import React from "react";
import { Button } from "react-bootstrap";

export default props => {
  return (
    <Button
      variant="light"
      style={{
        borderRadius: 0,
        top: "0.05em"
        // boxShadow: "0.06em -0.15em 0.35em rgba(0, 0, 0, .04)"
      }}
      className="text-secondary position-relative rounded-top border text-nowrap"
      {...props}
    >
      {props.children}
    </Button>
  );
};
