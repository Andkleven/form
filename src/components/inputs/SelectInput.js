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
  options.map(option => {
    let label = option.value;
    label = label.replace(/([A-Z])/g, " $1");
    label = label.replace(/([0-9])/g, " $1");
    label = label.charAt(0).toUpperCase() + label.slice(1);
    return (option.label = label);
  });
  return (
    <Form.Group className={props.tight && "mb-1"}>
      {props.label && <Form.Label>{props.label}</Form.Label>}
      <div className="d-flex text-dark">
        {props.custom ? (
          <Creatable
            className="w-100"
            options={options}
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
            className="w-100"
            options={options}
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
            placeholder={props.placeholder || "Select..."}
            value={props.value}
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
