import GetValue from "./GetValue";

export default (
  label,
  value = undefined,
  indexVariableLabel = undefined,
  repeatStep = undefined,
  queryNameVariableLabel = undefined,
  fieldNameVariableLabel = undefined,
  index = undefined
) => {
  if (!label) {
    return "";
  }
  let variableLabel = undefined;
  if (index === undefined) {
    variableLabel = GetValue(
      value,
      queryNameVariableLabel,
      indexVariableLabel ? repeatStep + indexVariableLabel : repeatStep,
      fieldNameVariableLabel
    );
  } else {
    variableLabel = index;
  }
  let newLabel;
  if (variableLabel === undefined) {
    newLabel = label.replace("{", "");
    newLabel = newLabel.replace("}", "");
  } else {
    let firstName = label.split("{")[0];
    let lastName = label.split("}")[label.split("}").length - 1];
    newLabel = firstName + variableLabel + lastName;
  }
  return newLabel;
};
