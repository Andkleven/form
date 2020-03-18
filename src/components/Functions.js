import objectPath from "object-path";
import { Fragment } from "react";

export const stringToDictionary = data => {
  if (typeof data === "string") {
    return JSON.parse(data.replace(/'/g, '"'));
  }
};

export const getDataFromQuery = (data, path, field) => {
  if (!data) {
    return null;
  }
  let stringFields = objectPath.get(data, path, null);
  if (stringFields === null) {
    return null;
  }
  let fields = stringToDictionary(stringFields.data);
  if (!fields) {
    return null;
  }
  return fields[field];
};

export const findValue = (
  data,
  firstQuery,
  secendQuery = null,
  thirdQuery = null,
  whichFirstIndex = 0,
  whichSecendIndex = 0,
  repeatStepList = []
) => {
  let path;
  if (thirdQuery !== null) {
    path = `${firstQuery}.${repeatStepList[0] +
      whichFirstIndex}.${secendQuery}.${repeatStepList[1] +
      whichSecendIndex}.${thirdQuery}`;
  } else if (secendQuery !== null) {
    path = `${firstQuery}.${repeatStepList[0] +
      whichFirstIndex}.${secendQuery}`;
  } else {
    path = `${firstQuery}`;
  }
  return objectPath.get(data, path, null);
};

export const sumFieldInObject = (object, key) => {
  let total = 0;
  Object.values(object).forEach(value => {
    total += Number(value[key]);
  });
  return total;
};

export const getValue = (value, queryName, indexNumber, fieldName) => {
  let test;

  if (
    value[queryName] &&
    value[queryName][indexNumber] !== undefined &&
    value[queryName][indexNumber][fieldName] !== undefined
  ) {
    test = value[queryName][indexNumber][fieldName];
  }

  return test;
};

export const emptyField = field => [null, undefined, ""].includes(field);

export const getLastObjectValue = (object, key) =>
  object[Object.values(object).length - 1][key];

export const allFalse = element => !element;

export const allTrue = element => element;

export const allZeroOrNaN = element => element === 0 || isNaN(element);

export const removeSpace = string => string.replace(/\s/g, "");

export const notDataInField = (getDataFromGroupWithLookUpBy, lookUpBy) => {
  return (
    !getDataFromGroupWithLookUpBy ||
    !getDataFromGroupWithLookUpBy.data ||
    !getDataFromGroupWithLookUpBy.data[lookUpBy]
  );
};

export const emptyObject = objectToCheck => {
  if (Object.entries(objectToCheck).length === 0) {
    return true;
  }
  return false;
};

export const removeEmptyValueFromObject = object => {
  Object.keys(object).forEach(key => {
    if ([null, undefined, ""].includes(object[key])) {
      delete object[key];
    }
  });
};

export const variableString = (variable, string) => {
  let newString;
  if ([undefined, null, ""].includes(variable)) {
    newString = string.replace("{", "");
    newString = newString.replace("}", "");
  } else {
    let firstName = string.split("{")[0];
    let lastName = string.split("}")[string.split("}").length - 1];

    newString = firstName + variable + lastName;
  }
  return newString;
};

export const variableLabel = (
  label,
  value,
  firstQueryVariableLabel = undefined,
  secendQueryVariableLabel = undefined,
  thirdQueryVariableLabel = undefined,
  firstIndexVariableLabel = undefined,
  secendIndexVariableLabel = undefined,
  repeatStepList = [],
  index = undefined
) => {
  if (!label) {
    return "";
  }
  let variableLabel = undefined;

  if (index === undefined) {
    variableLabel = findValue(
      value,
      firstQueryVariableLabel,
      secendQueryVariableLabel,
      thirdQueryVariableLabel,
      firstIndexVariableLabel,
      secendIndexVariableLabel,
      repeatStepList[0]
    );
  } else {
    variableLabel = index + 1;
  }
  return variableString(variableLabel, label);
};

export const variableSubtext = (
  subtext,
  data,
  routToSpeckSubtext,
  fieldSpeckSubtext
) => {
  let variable;
  if (routToSpeckSubtext && fieldSpeckSubtext) {
    variable = getDataFromQuery(data, routToSpeckSubtext, fieldSpeckSubtext);
  }
  return variableString(variable, subtext);
};

export const getSubtext = (
  subtext,
  data,
  routToSpeckSubtext,
  fieldSpeckSubtext,
  max,
  min,
  maxInput,
  minInput,
  unit,
  required
) => {
  if (subtext) {
    return variableSubtext(
      subtext,
      data,
      routToSpeckSubtext,
      fieldSpeckSubtext
    );
  }
  let minLocal = min ? min : minInput ? minInput : "";
  let maxLocal = max ? max : maxInput ? maxInput : "";

  let minString = minLocal === "" ? "" : `Min: ${minLocal}`;
  let maxString = maxLocal === "" ? "" : `Max: ${maxLocal}`;

  let unitString = unit ? `${unit} ` : " ";

  minString = minString ? minString + unitString : "";
  maxString = maxString ? maxString + unitString : "";

  let requiredString = required ? "Required" : "";

  return minString + maxString + requiredString;
};

export const expandJson = json => {
  // Turns data strings into data dictionaries where applicable
  if (json) {
    const jsonIsExpandable = json => {
      // A bit shady test for if the JSON is expandable
      let expandable = true;
      if (json.projects[0].data === undefined) {
        expandable = false;
      }
      return expandable;
    };

    if (jsonIsExpandable(json)) {
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
  }
  return json;
};

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

export const validaFieldWithValue = validation => {
  Object.keys(validation).forEach(key => {
    if (!validation[key]) {
      return false;
    }
  });
  return true;
};

export const calculateMaxMin = (
  min,
  routToSpeckMin,
  fieldSpeckMin,
  max,
  routToSpeckMax,
  fieldSpeckMax,
  data
) => {
  let newMin;
  let newMax;
  if (routToSpeckMin && fieldSpeckMin) {
    newMin = getDataFromQuery(data, routToSpeckMin, fieldSpeckMin);
  } else {
    newMin = min;
  }
  if (routToSpeckMax && fieldSpeckMax) {
    newMax = getDataFromQuery(data, routToSpeckMax, fieldSpeckMax);
  } else {
    newMax = max;
  }
  return { min: newMin, max: newMax };
};

export const chapterPages = (
  props,
  view,
  firstIndex,
  stopLoop,
  editField,
  pageInfo,
  lastChapter
) => {
  return pageInfo.pages.map((info, index) => {
    let showEditButton = !props.notEditButton && !index ? true : false;
    let showSaveButton =
      index === pageInfo.pages.length - 1 &&
      !editField &&
      !props.notSubmitButton
        ? true
        : false;
    let page = view(
      info,
      index,
      firstIndex + 1,
      stopLoop,
      showEditButton,
      lastChapter,
      showSaveButton
    );
    return <Fragment key={`${index}-${firstIndex}-cancas`}>{page}</Fragment>;
  });
};

// Get data to Group or test if group have data in database
export const getData = (info, arrayIndex, documentDate, isItData = false) => {
  let data;
  if (!documentDate) {
    return null;
  } else if (info.firstQueryPath) {
    data = objectPath.get(
      objectPath.get(documentDate, `${info.firstQueryPath}.${arrayIndex}`),
      info.secondQueryPath
    );
  } else if (documentDate) {
    data = objectPath.get(documentDate, info.queryPath);
  } else {
  }
  if (isItData) {
    return data[info.findByIndex ? arrayIndex : data.length - 1];
  } else if (info.findByIndex) {
    return data[arrayIndex];
  } else {
    return data;
  }
};

export const mergePath = (info, arrayIndex, oldPath = null) => {
  let path = oldPath === null ? "" : `${oldPath}.`;
  if (info.firstQueryPath) {
    path = `${path}${info.firstQueryPath}.${arrayIndex}.${
      info.secondQueryPath
    }`;
  } else if (info.findByIndex) {
    path = `${path}${info.queryPath}.${arrayIndex}`;
  } else if (info.queryPath) {
    path = `${path}${info.queryPath}`;
  } else {
    return null;
  }
  return path;
};

export const objectifyQuery = query => {
  if (query) {
    let newObject = JSON.parse(JSON.stringify(query));
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
        } else if (key === "__typename") {
          objectPath.del(newObject, path);
        }
      });
    };
    objectifyEntries(query);
    return newObject;
  }
};

export const stringifyQuery = query => {
  let newObject = { ...query };
  const loopThroughQuery = (query, oldPath = null) => {
    let path;
    Object.keys(query).forEach(key => {
      path = oldPath === null ? key : oldPath + "." + key;
      if (Array.isArray(query[key])) {
        query[key].forEach((value, index) => {
          loopThroughQuery(value, path + "." + index.toString());
        });
      } else if (key === "data") {
        let isData = JSON.stringify(query[key]);
        if (isData) {
          objectPath.set(newObject, path, isData);
        }
      }
    });
  };
  loopThroughQuery(query);
  return newObject;
};
