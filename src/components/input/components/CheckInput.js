import React from "react";
import { Form } from "react-bootstrap";

export default props => (
  <Form.Group className={props.tight ? "mb-0" : "mb-3"}>
    <div className="d-flex justify-content-between">
      <div className="d-flex align-items-center flex-wrap">
        <Form.Check
          custom
          autoFocus={props.focus}
          type={props.type}
          required={props.required}
          disabled={
            props.readOnlyFields ? props.readOnlyFields : props.readOnly
          }
          id={`custom-${props.type}-${props.label}-${props.repeatStepList}`}
          label={props.label}
          defaultChecked={props.defaultValue}
          checked={props.value || props.checked}
          name={props.name}
          onChange={props.onChange}
          onBlur={props.onBlur}
          className={`mb-0 pb-0 ${props.labelAppend && "mr-1"} ${
            props.className
          }`}
          size={props.size}
        />
        {!!props.labelAppend ? (
          <>
            {!!props.labelAppend &&
              props.labelAppend !== "false" &&
              props.labelAppend}
          </>
        ) : null}
      </div>
      {props.TinyButtons}
    </div>
    {props.subtext && (
      <Form.Text className="text-muted">{props.subtext}</Form.Text>
    )}
  </Form.Group>
);
