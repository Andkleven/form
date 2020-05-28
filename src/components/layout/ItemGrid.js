import React from "react";
import { Row } from "react-bootstrap";

export default props => {
  return (
    <Row className="no-gutters" style={props.style} {...props}>
      {props.children}
    </Row>
  );
};
