import React from "react";
import { Row } from "react-bootstrap";

export default props => {
  return <Row className="no-gutters">{props.children}</Row>;
};
