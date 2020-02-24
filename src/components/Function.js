export const sumFieldInObject = (object, key) => {
  let total = 0;
  Object.values(object).forEach(value => {
    total += Number(value[key]);
  });
  return total;
};

export const getLastObjectValue = (object, key) => {
  return object[Object.values(object).length - 1][key];
};

export const allFalse = element => !element;

export const allTrue = element => element;

export const allZeroOrNaN = element => element === 0 || isNaN(element);

export const getSubtext = (
  subtext,
  max,
  min,
  maxInput,
  minInput,
  unit,
  required
) => {
  if (subtext) {
    return subtext;
  }
  let minLocal = min ? min : minInput ? minInput : null;
  let maxLocal = max ? max : maxInput ? maxInput : null;

  let minString = minLocal === null ? "" : `Min: ${minLocal}`;
  let maxString = maxLocal === null ? "" : `Max: ${maxLocal}`;

  let unitString = unit ? `${unit} ` : " ";

  let requiredString = required ? "Required" : "";

  return minString + unitString + maxString + unitString + requiredString;
};
