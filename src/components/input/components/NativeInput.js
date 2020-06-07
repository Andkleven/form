import React from "react";
import { Form, InputGroup } from "react-bootstrap";
// import Duplicate from "../widgets/Duplicate";
function NativeInput(props) {
  return (
    <>
      <Form.Group className={props.tight && "mb-1"} >
        <div className="d-flex">
          <InputGroup className="d-flex" >
            {props.prepend ? (
              <InputGroup.Prepend>
                <InputGroup.Text className="bg-light text-secondary">
                  {props.prepend}
                </InputGroup.Text>
              </InputGroup.Prepend>
            ) : null}
            <Form.Control
              // autoFocus={props.focus}
              isValid={props.isValid}
              isInvalid={props.isInvalid}
              id={`custom-${props.type}-${props.label}-${props.repeatStepList}`}
              required={props.required}
              readOnly={props.readOnlyFields ? props.readOnlyFields : props.readOnly}
              defaultValue={props.defaultValue}
              name={props.name}
              onChange={props.onChange}
              onBlur={props.onBlur}
              as={props.select}
              type={props.type}
              min={props.min}
              max={props.max}
              step={props.step}
              placeholder={props.placeholder}
              // className={(!props.unit || !props.append) && "rounded"}
            >
              {props.options &&
                props.options.map((option, index) => {
                  return <option key={index}>{option}</option>;
                })}
            </Form.Control>
            {(props.unit || props.append) && (
              <InputGroup.Append>
                {props.unit && (
                  <InputGroup.Text className="bg-light text-secondary">
                    {props.unit}
                  </InputGroup.Text>
                )}
                {props.append}
              </InputGroup.Append>
            )}
            {props.feedback && (
              <>
                {/* <Form.Control.Feedback type="valid">
              {props.feedback}
            </Form.Control.Feedback> */}
                <Form.Control.Feedback type="invalid">
                  {props.feedback}
                </Form.Control.Feedback>
              </>
            )}
          </InputGroup>
          {/* <Duplicate {...props} /> */}
        </div>
        {props.subtext && (
          <Form.Text className="text-muted">{props.subtext}</Form.Text>
        )}
      </Form.Group>
    </>
  );
}

export default NativeInput;
