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

  let requiredString = required ? "Required" : "";

  return minString + unitString + maxString + unitString + requiredString;
};

export const stringToDictionary = data => {
  if (typeof data === "string") {
    return JSON.parse(data.replace(/'/g, '"'));
  }
};

export const expandJson = json => {
  if (json) {
    json.projects &&
      json.projects.map(project => {
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

export const searchProjects = (data, term) => {
  let results = [];
  if (data) {
    const findAllProjects = data => {
      if (data.projects) {
        const projects = data.projects;
        return projects;
      }
    };

    const projects = findAllProjects(data);

    const hasChildren = element => {
      const isNonEmptyObject =
        element.constructor === Object && Object.entries(element).length > 0;
      const isNonEmptyArray =
        Array.isArray(element) &&
        element.length > 0 &&
        typeof element !== "string";
      if (isNonEmptyObject || isNonEmptyArray) {
        return true;
      }
      return false;
    };

    const elementOrChildrenMatches = (element, term) => {
      let match = false;

      const recurse = (element, term) => {
        if (match === true) {
          // May not be necessary
          return;
        } else {
          if (typeof element === "string" && element.includes(term)) {
            match = true;
            return;
          } else if (hasChildren(element)) {
            element = Object.entries(element);
            element.forEach(child => {
              const childElement = child[1];
              recurse(childElement, term);
            });
          }
        }
      };

      recurse(element, term);

      return match;
    };

    const getMatchingProjects = (projects, term) => {
      if (projects) {
        projects.forEach(project => {
          if (elementOrChildrenMatches(project, term)) {
            results.push(project);
          }
        });
      }
    };

    getMatchingProjects(projects, term);
  }
  return results;
};
