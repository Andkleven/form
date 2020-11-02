import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import moment from "moment";
import { dialog } from "components/Dialog";

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
      min =
        min &&
        `${min[6]}${min[7]}${min[8]}${min[9]}-${min[3]}${min[4]}-${min[0]}${min[1]}`;
      max =
        max &&
        `${max[6]}${max[7]}${max[8]}${max[9]}-${max[3]}${max[4]}-${max[0]}${max[1]}`;
      break;
    case "datetime-local":
      value = value && moment(value).format(moment.HTML5_FMT.DATETIME_LOCAL);
      min =
        min &&
        `${min[6]}${min[7]}${min[8]}${min[9]}-${min[3]}${min[4]}-${min[0]}${min[1]}T${min[11]}${min[12]}:${min[14]}${min[15]}`;
      max =
        max &&
        `${max[6]}${max[7]}${max[8]}${max[9]}-${max[3]}${max[4]}-${max[0]}${max[1]}T${max[11]}${max[12]}:${max[14]}${max[15]}`;
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
              id={`custom-${
                type
                  ? typeof type === "string" && type.toLowerCase()
                  : "no-type"
              }-${label}-${repeatStepList}`}
              name={name}
              required={required}
              // readOnly={readOnlyFields ? readOnlyFields : readOnly}
              readOnly={readOnly}
              value={value}
              onChange={onChangeInput}
              onBlur={onBlur}
              type={
                type &&
                typeof type === "string" &&
                type.toLowerCase() !== "comment"
                  ? type
                  : ""
              }
              as={
                type &&
                typeof type === "string" &&
                type.toLowerCase() === "comment"
                  ? "textarea"
                  : "input"
              }
              style={
                type &&
                typeof type === "string" &&
                type.toLowerCase() === "comment"
                  ? { resize: "none" }
                  : undefined
              }
              rows={
                type &&
                typeof type === "string" &&
                type.toLowerCase() === "comment"
                  ? "5"
                  : undefined
              }
              min={props.ignoreMin ? undefined : min}
              max={props.ignoreMax ? undefined : max}
              step="any"
              placeholder={placeholder}
              onKeyPress={e => {
                onKeyPress(e);
                if (
                  [","].includes(e.key) &&
                  type &&
                  typeof type === "string" &&
                  type.toLowerCase() === "number"
                ) {
                  dialog({
                    message: (
                      <div className="text-center">
                        <div>
                          Strict number inputs only accepts <b>periods</b> as
                          decimal points.
                        </div>
                        <div>
                          You can recognize them by their up- and down-ticks.
                        </div>
                      </div>
                    ),
                    closeName: "Understood"
                  });
                }
              }}
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
