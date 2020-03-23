import React from "react";
import { Card } from "react-bootstrap";

export default props => (
    <Card
      className={`shadow-sm ${props.darkMode && "bg-dark"}`}
      style={{
        minHeight: props.fullPage && "100%",
        color: props.darkMode && "#d5d5d5"
      }}
    >
      <Card.Body className="h-100">{props.children}</Card.Body>
    </Card>
);
