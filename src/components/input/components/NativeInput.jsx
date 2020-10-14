import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import moment from "moment";
// import BatchButton from "components/button/BatchButton";
// import Duplicate from "../widgets/Duplicate";
export default ({
  type,
  batchClick,
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
  itemIdsRef,
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
}) => {
  // Format datetime values
  // https://momentjs.com/docs/#/parsing/special-formats/
  switch (type) {
    case "date":
      value = value && moment(value).format(moment.HTML5_FMT.DATE);
      min = min && moment(min).format(moment.HTML5_FMT.DATE);
      max = max && moment(max).format(moment.HTML5_FMT.DATE);
      break;
    case "datetime-local":
      value = value && moment(value).format(moment.HTML5_FMT.DATETIME_LOCAL);
      min = min && moment(min).format(moment.HTML5_FMT.DATETIME_LOCAL);
      max = max && moment(max).format(moment.HTML5_FMT.DATETIME_LOCAL);
      break;
    default:
      break;
  }
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
              type={type !== "comment" ? type : ""}
              as={type === "comment" ? "textarea" : "input"}
              style={type === "comment" ? { resize: "none" } : undefined}
              rows={type === "comment" ? "5" : undefined}
              min={props.ignoreMin ? undefined : min}
              max={props.ignoreMax ? undefined : max}
              step={
                unit === "mm" ? 0.1 : !!unit ? 0.01 : step ? step : undefined
              }
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
            {/* <BatchButton batchClick={batchClick} /> */}
          </InputGroup>
        </div>
        {subtext && <Form.Text className="text-muted">{subtext}</Form.Text>}
      </Form.Group>
    </>
  );
};
