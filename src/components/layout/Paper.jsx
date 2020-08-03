import React from "react";
import { Card } from "react-bootstrap";

export default ({ ...props }) => (
  <div full={props.full ? props.full.toString() : "false"} dark={props.dark ? props.dark.toString() : "false"}>
    <Card
      className={`shadow ${props.dark && "bg-dark"}`}
      style={{
        minHeight: props.full && "100%",
        color: props.dark && "#d5d5d5"
      }}
    >
      <Card.Body className="h-100">{props.children}</Card.Body>
    </Card>
  </div>
);
