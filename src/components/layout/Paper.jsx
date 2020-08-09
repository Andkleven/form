import React from "react";
import { Card } from "react-bootstrap";

export default ({ full = false, dark = false, ...props }) => (
  <div {...props}>
    {/* <div
      full={props.full ? props.full.toString() : false}
      dark={props.dark ? props.dark.toString() : false}
    > */}
    <Card
      className={`shadow ${dark && "bg-dark"}`}
      style={{
        minHeight: full && "100%",
        color: dark && "#d5d5d5"
      }}
    >
      <Card.Body className="h-100">{props.children}</Card.Body>
    </Card>
    {/* </div> */}
  </div>
);
