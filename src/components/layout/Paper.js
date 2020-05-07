import React from "react";
import { Card } from "react-bootstrap";

export default props => (
  <Card
    className={`shadow-sm ${props.dark && "bg-dark"}`}
    style={{
      minHeight: props.full && "100%",
      color: props.dark && "#d5d5d5"
    }}
  >
    <Card.Body className="h-100">{props.children}</Card.Body>
  </Card>
);
