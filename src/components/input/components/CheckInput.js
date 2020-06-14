import React from "react";
import { Form } from "react-bootstrap";

export default props => (
  <Form.Group className={props.tight ? "mb-0" : "mb-3"}>
    <div className="d-flex justify-content-between">
      <Form.Check
        custom
        autoFocus={props.focus}
        type={props.type}
        required={props.required}
        disabled={props.readOnlyFields ? props.readOnlyFields : props.readOnly}
        id={`custom-${props.type}-${props.label}-${props.repeatStepList}`}
        label={props.label}
        defaultChecked={props.defaultValue}
        checked={props.value}
        name={props.name}
        onChange={props.onChange}
        onBlur={props.onBlur}
        className="mb-0 pb-0"
      />
      {props.TinyButtons}
    </div>
    {props.subtext && (
      <Form.Text className="text-muted">{props.subtext}</Form.Text>
    )}
  </Form.Group>
);
