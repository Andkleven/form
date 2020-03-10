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

export const searchProjects = (data, terms) => {
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
        element &&
        element.constructor === Object &&
        Object.entries(element).length > 0;
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
          if (
            typeof element === "string" &&
            element.toLowerCase().includes(term)
          ) {
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

    const projectNotInResults = (project, results) => {
      return !results.includes(project);
    };

    const resultsIntersection = resultsArray => {
      let intersectingResults = resultsArray.shift();
      resultsArray.forEach(results => {
        intersectingResults = intersectingResults.filter(x =>
          results.includes(x)
        );
      });
      return intersectingResults;
    };

    const getMatchingProjects = (projects, terms) => {
      let resultsArray = [];
      terms.forEach(term => {
        term = term.toLowerCase();
        let termResults = [];
        if (projects && Array.isArray(projects)) {
          projects.forEach(project => {
            if (
              elementOrChildrenMatches(project, term) &&
              projectNotInResults(project, results)
            ) {
              termResults.push(project);
            }
          });
        }
        resultsArray.push(termResults);
      });
      results = resultsIntersection(resultsArray);
    };

    getMatchingProjects(projects, terms);
  }
  return results;
};

export const objectifyQuery = query => {
  if (query) {
    let newObject = { ...query };

    const objectifyEntries = (query, oldPath = null) => {
      let path;
      Object.keys(query).forEach(key => {
        path = oldPath === null ? key : oldPath + "." + key;
        if (Array.isArray(query[key])) {
          query[key].forEach((value, index) => {
            objectifyEntries(value, path + "." + index.toString());
          });
        } else if (key === "data") {
          if (typeof query[key] === "string") {
            let isData = stringToDictionary(query[key]);
            if (isData) {
              objectPath.set(newObject, path, isData);
            }
          }
        }
      });
    };

    objectifyEntries(query);
    return newObject;
  }
};
