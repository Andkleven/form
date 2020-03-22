import React from "react";
import { Form } from "react-bootstrap";

export default props => (
  <Form.Group className={props.tight && "mb-1"}>
    <Form.Check
      custom
      type={props.type}
      readOnly={props.readOnlyFields}
      id={`custom-${props.type}-${props.label}`}
      label={props.label}
      value={props.value}
      name={props.name}
      onChange={props.onChange}
    />
    {props.subtext && (
      <Form.Text className="text-muted">{props.subtext}</Form.Text>
    )}
  </Form.Group>
);
