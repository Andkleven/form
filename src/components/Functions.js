import objectPath from "object-path";

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

export const emptyObject = objectToCheck =>
  Object.entries(objectToCheck).length === 0;

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

  minString = minString ? minString + unitString : null;
  maxString = maxString ? maxString + unitString : null;

  let requiredString = required ? "Required" : null;

  return minString + maxString + requiredString;
};

export const stringToDictionary = data => {
  if (typeof data === "string") {
    return JSON.parse(data.replace(/'/g, '"'));
  }
};

export const expandJson = json => {
  if (json.data) {
    json.data.projects &&
      json.data.projects.map(project => {
        project.data = stringToDictionary(project.data);
        project.descriptions &&
          project.descriptions.map(description => {
            description.data = stringToDictionary(description.data);
            description.items &&
              description.items.map(item => {
                item.data = stringToDictionary(item.data);
                return true;
              });
            return true;
          });
        return true;
      });
  }
  return json;
};

export const getDataFromQuery = (data, path, field) => {
  if (!data) {
    return null;
  }
  let stringFields = objectPath.get(data, path);
  if (!stringFields) {
    return null;
  }
  let fields = stringToDictionary(stringFields.data);
  if (!fields) {
    return null;
  }
  return fields[field];
};

export const removeSpace = string => string.replace(/\s/g, "");
