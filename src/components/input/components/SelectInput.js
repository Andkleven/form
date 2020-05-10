import React from "react";
import { Form } from "react-bootstrap";
import Creatable from "react-select/creatable";
import Select from "react-select";
import { camelCaseToNormal } from "functions/general";

// import Duplicate from "./widgets/Duplicate";

export default props => {
  let options = [];
  props.options.forEach(element => {
    options.push({
      value: element
    });
  });

  options.unshift({ value: null, label: "None" });

  options.map(option => {
    let label = option.value;
    label = camelCaseToNormal(label);
    return (option.label = label);
  });

  return (
    <Form.Group className={props.tight && "mb-1"}>
      <div className="d-flex text-dark">
        {props.custom ? (
          <Creatable
            className="w-100"
            name={props.name}
            readOnly={props.readOnlyFields}
            options={options}
            defaultValue={props.defaultValue
              ? options.find(option => option.value === props.defaultValue)
              : null}
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
            placeholder={props.placeholder || "Select or type..."}
            onChange={props.onChangeSelect}
            onBlur={props.onBlurSelect}
          />
        ) : (
          <Select
            className="w-100"
            options={options}
            name={props.name}
            defaultValue={props.defaultValue
              ? options.find(option => option.value === props.defaultValue)
              : null}
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
            isSearchable={true}
            placeholder={props.placeholder || "Select..."}
            onChange={props.onChangeSelect}
            onBlur={props.onBlurSelect}
          />
        )}
        {/* <Duplicate {...props} /> */}
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
