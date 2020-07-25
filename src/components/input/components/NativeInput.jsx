import React from "react";
import { Form, InputGroup } from "react-bootstrap";
// import Duplicate from "../widgets/Duplicate";
function NativeInput({
  type,
  label,
  name,
  value,
  defaultValue,
  placeholder,
  unit,
  prepend,
  append,
  subtext,
  feedback,
  isValid,
  isInvalid,
  required,
  min,
  max,
  // onChange,
  onBlur,
  repeatStepList,
  // readOnlyFields,
  readOnly,
  step,
  onChangeInput,
  onKeyPress,
  ...props
}) {
  return (
    <>
      <Form.Group
        className="mb-0"
        // controlId={`input-group-${type}-${props.name}-${repeatStepList}`}
      >
        <div className="d-flex">
          <InputGroup className="d-flex">
            {prepend ? (
              <InputGroup.Prepend>
                <InputGroup.Text className="bg-light text-secondary">
                  {prepend}
                </InputGroup.Text>
              </InputGroup.Prepend>
            ) : null}
            <Form.Control
              isValid={isValid}
              isInvalid={isInvalid}
              id={`custom-${type}-${label}-${repeatStepList}`}
              name={name}
              required={required}
              // readOnly={readOnlyFields ? readOnlyFields : readOnly}
              readOnly={readOnly}
              value={value}
              onChange={onChangeInput}
              onBlur={onBlur}
              type={type}
              min={min}
              max={max}
              step={step}
              placeholder={placeholder}
              onKeyPress={onKeyPress}
            ></Form.Control>
            {(unit || append) && (
              <InputGroup.Append>
                {unit && (
                  <InputGroup.Text className="bg-light text-secondary">
                    {unit}
                  </InputGroup.Text>
                )}
                {append}
              </InputGroup.Append>
            )}
          </InputGroup>
        </div>
        {subtext && <Form.Text className="text-muted">{subtext}</Form.Text>}
      </Form.Group>
    </>
  );
}

export default NativeInput;
