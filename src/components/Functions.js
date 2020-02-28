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

export const stringToDictionary = data => {
  if (typeof data === "string") {
    return JSON.parse(data.replace(/'/g, '"'));
  }
};

export const expandJson = json => {
  if (json.data) {
    json.data.createProject.map((project, index) => {
      project.data = stringToDictionary(project.data);
      project.category &&
        project.category.map((category, index) => {
          category.data = stringToDictionary(category.data);
          category.item &&
            category.item.map((item, index) => {
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
