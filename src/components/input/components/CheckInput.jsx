import React from "react";
import { Form } from "react-bootstrap";

export default props => (
  <Form.Group className="mb-0">
    <div className="d-flex justify-content-between">
      <div className="d-flex align-items-center flex-wrap">
        <Form.Check
          custom
          autoFocus={props.focus}
          type={props.type}
          required={props.required}
          disabled={props.disabled}
          id={
            props.id ||
            `custom-${props.type}-${props.fieldName}-${props.repeatStepList}`
          }
          label={props.label}
          checked={props.value}
          name={props.name}
          onChange={props.onChangeInput}
          onBlur={props.onBlur}
          className={`mb-0 pb-0 ${props.labelAppend && "mr-1"} ${
            props.className
          }`}
          size={props.size}
          onKeyPress={props.onKeyPress}
          style={{ zIndex: 0 }}
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
