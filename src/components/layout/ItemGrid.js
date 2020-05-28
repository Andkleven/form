import React from "react";
import { Row } from "react-bootstrap";

export default props => {
  return (
    <Row className="no-gutters" {...props}>
      {props.children}
    </Row>
  );
};
