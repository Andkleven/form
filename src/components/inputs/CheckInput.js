import React from "react";
import { Form } from "react-bootstrap";

export default props => (
  <Form.Group>
    <Form.Check
      custom
      type={props.type}
      id={`custom-${props.type}-${props.label}`}
      label={props.label}
    />
    <Form.Text className="text-muted">{props.subtext}</Form.Text>
  </Form.Group>
);
