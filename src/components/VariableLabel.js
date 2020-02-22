import getValue from "./GetValueFromValues";

function VariableLabel(
  label,
  values,
  indexVariableLabel,
  listIndex,
  queryNameVariableLabel,
  fieldNameVariableLabel
) {
  let variableLabel = getValue(
    values,
    queryNameVariableLabel,
    indexVariableLabel ? listIndex + indexVariableLabel : listIndex,
    fieldNameVariableLabel
  );
  let newLabel;
  if (variableLabel) {
    let firstName = label.split("{")[0];
    let lastName = label.split("}")[label.split("}").length - 1];
    newLabel = firstName + variableLabel + lastName;
  } else {
    newLabel = label.replace("{", "");
    newLabel = newLabel.replace("}", "");
  }
  return newLabel;
}

export default VariableLabel;
