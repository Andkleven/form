import React from "react";
import { Form } from "react-bootstrap";
import Creatable from "react-select/creatable";
import Select from "react-select";

import Duplicate from "./widgets/Duplicate";

export default props => {
  let options = [];
  props.options.forEach(element => {
    options.push({
      value: element
    });
  });

  const camelCaseToNormal = string => {
    if (!string.includes(" ")) {
      string = string[0] + string.slice(1).replace(/([A-Z])/g, " $1");
    }
    string = string.replace(/([0-9])/g, " $1");
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string;
  };

  options.map(option => {
    let label = option.value;
    label = camelCaseToNormal(label);
    return (option.label = label);
  });

  return (
    <Form.Group className={props.tight && "mb-1"}>
      {props.label && <Form.Label>{props.label}</Form.Label>}
      <div className="d-flex text-dark">
        {props.custom ? (
          <Creatable
            className="w-100"
            options={props.options}
            name={props.name}
            readOnly={props.readOnlyFields}
            theme={theme => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "#FBECD6",
                primary50: "#FBECD6",
                primary75: "#FBECD6",
                primary: "#f1b25b"
              }
            })}
            isClearable={true}
            placeholder={props.placeholder || "Select or type..."}
            value={props.value}
            onChange={props.onChange}
          />
        ) : (
          <Select
            id={`custom-${props.type}-${props.label}`}
            className="w-100"
            options={props.options}
            theme={theme => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "#FBECD6",
                primary50: "#FBECD6",
                primary75: "#FBECD6",
                primary: "#f1b25b"
              }
            })}
            isClearable={true}
            isSearchable={true}
            value={
              props.value
                ? options.find(option => option.value === props.value)
                : null
            }
            placeholder={props.placeholder || "Select..."}
            onChange={props.onChange}
          />
        )}
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
};
