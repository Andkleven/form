import React from "react";
import { Form } from "react-bootstrap";

export default props => (
  <Form.Group className={props.tight && "mb-0"}>
    <div className="d-flex justify-content-between">
      <Form.Check
        custom
        type={props.type}
        readOnly={props.readOnlyFields}
        id={`custom-${props.type}-${props.label}`}
        label={props.label}
        value={props.value}
        name={props.name}
        onChange={props.onChange}
        className="mb-0 pb-0"
      />
      {props.TinyButtons}
    </div>
    {props.subtext && (
      <Form.Text className="text-muted">{props.subtext}</Form.Text>
    )}
  </Form.Group>
);
