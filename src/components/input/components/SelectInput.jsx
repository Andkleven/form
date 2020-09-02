import React from "react";
import { Form } from "react-bootstrap";
import Creatable from "react-select/creatable";
// import Select from "react-select";
import { camelCaseToNormal } from "functions/general";

// import Duplicate from "./widgets/Duplicate";

export default props => {
  let options = [];
  if (props.optionsData && props.userRole) {
    props.optionsData.userProfile.forEach(element => {
      if (props.userRole.includes(element.role.toLowerCase())) {
        options.push({
          value: element.name
        });
      }
    });
  } else if (props.options) {
    props.options.forEach(element => {
      options.push({
        value: element
      });
    });
  }

  // const placeholder = props.custom
  //   ? props.placeholder || "Select or type..."
  //   : props.placeholder || "Select...";
  const placeholder = props.placeholder || "Select or type...";

  options.unshift({
    value: "",
    label: placeholder
  });

  options.map((option, index) => {
    if (index > 0) {
      let label;
      if (props.selectAutoFormat) {
        label = camelCaseToNormal(option.value);
      } else {
        label = option.value;
      }
      return (option.label = label);
    } else {
      const label = "―";
      return (option.label = label);
    }
  });

  const selectProps = {
    className: "w-100",
    name: props.name,
    id: `custom-${props.type}-${props.label}-${props.repeatStepList}`,
    options: options,
    theme: theme => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary25: "#FBECD6",
        primary50: "#FBECD6",
        primary75: "#FBECD6",
        primary: "#f1b25b"
      }
    }),
    value: {
      label:
        props.value && props.placeholder && !props.label && !props.prepend
          ? `${props.placeholder}: ${camelCaseToNormal(props.value)}`
          : props.value
          ? camelCaseToNormal(props.value)
          : placeholder
    },
    isSearchable: true,
    placeholder: placeholder,
    onChange: props.onChangeSelect,
    autoFocus: props.focus,
    isDisabled: props.readOnlyFields ? props.readOnlyFields : props.readOnly,
    onKeyDown: props.onKeyPress,
    styles: {
      menuPortal: base => ({ ...base, zIndex: 9999 }),
      menu: provided => ({ ...provided, zIndex: "9999 !important" })
    }
  };

  return (
    <>
      <div className="d-flex text-dark">
        <Creatable {...selectProps} />
      </div>

      {/* Extra semi-hidden input to enable native form control for required */}
      {!props.disabled && (
        <div className="d-flex justify-content-center w-100">
          <input
            tabIndex={-1}
            autoComplete="off"
            style={{
              opacity: 0,
              height: 0,
              width: "75%",
              position: "absolute",
              pointerEvents: "none"
            }}
            value={props.value}
            required={props.required}
          />
        </div>
      )}

      {props.subtext && (
        <Form.Text className="text-muted">{props.subtext}</Form.Text>
      )}
    </>
  );
};
