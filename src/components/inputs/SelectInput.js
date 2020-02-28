import React from "react";
import { Form } from "react-bootstrap";
import Creatable from "react-select/creatable";
import Select from "react-select";

import Duplicate from "./widgets/Duplicate";

export default props => {
  props.options.map(option => {
    let label = option.value;
    label = label.replace(/_/g, " ");
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
            placeholder={props.placeholder || "Select or type..."}
          />
        ) : (
          <Select
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
            isSearchable={false}
            placeholder={props.placeholder || "Select..."}
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
