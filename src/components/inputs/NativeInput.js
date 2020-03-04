import React from "react";
import { Form, InputGroup } from "react-bootstrap";

import Duplicate from "./widgets/Duplicate";

function NativeInput(props) {
  return (
    <Form.Group className={props.tight && "mb-1"}>
      {props.label && <Form.Label>{props.label}</Form.Label>}
      <div className="d-flex">
        <InputGroup className="">
          {props.prepend ? (
            <InputGroup.Prepend>
              <InputGroup.Text>{props.prepend}</InputGroup.Text>
            </InputGroup.Prepend>
          ) : null}
          <Form.Control
            id={`custom-${props.type}-${props.label}`}
            required={false}
            value={props.value}
            name={props.name}
            onChange={props.onChange}
            as={props.select}
            type={props.type}
            min={props.min}
            max={props.max}
            step={props.decimal}
            placeholder={props.placeholder}
          >
            {props.options &&
              props.options.map((option, index) => {
                return <option key={index}>{option}</option>;
              })}
          </Form.Control>
          {props.unit && (
            <InputGroup.Append>
              <InputGroup.Text className="">{props.unit}</InputGroup.Text>
            </InputGroup.Append>
          )}
        </InputGroup>
        <Duplicate {...props} />
      </div>
      {props.subtext && (
        <Form.Text className="text-muted">{props.subtext}</Form.Text>
      )}
      {props.feedback && (
        <Form.Control.Feedback type="invalid">
          {props.feedback}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}

export default NativeInput;
