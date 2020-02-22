import React, { useEffect, useContext } from "react";
import StaticInput from "./StaticInput";
import Input from "./Input";
import { ValuesContext } from "../page/canvas";

export default props => {
  const valuesContext = useContext(ValuesContext);
  useEffect(() => {
    if (
      valuesContext.values[props.count][props.name] !== undefined &&
      valuesContext.values[props.count][props.name][props.listIndex] !==
        undefined
    ) {
      valuesContext.setValues(prevState => ({
        ...prevState,
        [props.count]: {
          ...prevState[props.count],
          [props.name]: {
            ...prevState[props.count][props.name],
            [props.listIndex]: {
              ...prevState[props.count][props.name][props.listIndex],
              ...props.state
            }
          }
        }
      }));
    }
  }, [props.state]);

  const onChange = e => {
    let { name, value, type, step, min, max } = e.target;
    min = Number(min);
    max = Number(max);
    if (
      (!max && !min) ||
      (max && Number(value) < max) ||
      (min && min < Number(value))
    ) {
      if (["checkbox", "radio", "switch"].includes(type)) {
        props.setState(prevState => ({
          ...prevState,
          [name]: !props.state[name]
        }));
      } else {
        if (type === "number") {
          let decimal = step
            ? props.json.find(x => x.name === name).decimal
            : 0;
          var numberValue = value;
          if (
            numberValue.split(".")[1] &&
            decimal < numberValue.split(".")[1].length
          ) {
            numberValue = props.state[name];
          }
          props.setState(prevState => ({
            ...prevState,
            [name]: numberValue
          }));
        } else {
          props.setState(prevState => ({ ...prevState, [name]: value }));
        }
      }
    }
  };
  useEffect(() => {
    var saveInfo = {};
    saveInfo["step"] = props.onePage ? undefined : props.listIndex;
    saveInfo["foreignKey"] = props.foreignKey;
    saveInfo["id"] = props.id;
    valuesContext.setValues(prevState => ({
      ...prevState,
      [props.count]: {
        ...prevState[props.count],
        [props.name]: {
          ...prevState[props.count][props.name],
          [props.listIndex]: {
            ...prevState[props.count][props.name][props.listIndex],
            saveInfo
          }
        }
      }
    }));
  }, [props.listIndex, props.foreignKey, props.id]);
  // console.log(valuesContext.values);
  // console.log(props.state);

  return props.json.map((value, index) => {
    if (value.neverForm) {
      return (
        <StaticInput
          {...value}
          {...props}
          name={props.name}
          fieldName={value.name}
          key={`${props.index}-${index}`}
        />
      );
    } else {
      return (
        <Input
          {...value}
          {...props}
          key={`${props.index}-${index}`}
          value={props.state[value.name] ? props.state[value.name] : ""}
          file={value.type === "file" ? props.file : null}
          index={`${props.index}-${index}`}
          name={props.name}
          fieldName={value.name}
          onChange={onChange}
        />
      );
    }
  });
};
