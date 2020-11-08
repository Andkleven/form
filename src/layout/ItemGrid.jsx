import React from "react";
import { Row } from "react-bootstrap";

export default props => {
  return (
    <Row
      style={props.style}
      {...props}
      className={`no-gutters ${props.className}`}
    >
      {props.children}
    </Row>
  );
};
