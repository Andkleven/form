import React from "react";
import objectPath from "object-path";
import { Fragment } from "react";
import Math from "components/form/functions/math";

export const stringToDictionary = data => {
  if (typeof data === "string") {
    return JSON.parse(data.replace(/'/g, '"'));
  }
};

export const emptyField = field => [null, undefined, ""].includes(field);

export const isNumber = number => typeof number === "number";

export const isNumberAndNotNaN = number =>
  typeof number === "number" && !isNaN(number);

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

export const createPath = (
  pathList,
  repeatStepList = [],
  editRepeatStepList = {}
) => {
  let mergePath = "";
  if (Array.isArray(pathList)) {
    pathList.forEach((path, index) => {
      let getIndex = null;
      let lastPath = mergePath.split(".")[mergePath.split(".").length - 1];
      if (
        index &&
        isNumberAndNotNaN(repeatStepList[index - 1]) &&
        isNaN(Number(lastPath))
      ) {
        getIndex += repeatStepList[index - 1];
        if (isNumberAndNotNaN(editRepeatStepList[index - 1])) {
          getIndex += editRepeatStepList[index - 1];
        }
        mergePath += "." + getIndex.toString();
      }
      if (index !== 0 && path !== "" && mergePath !== "") {
        mergePath += ".";
      }
      mergePath += path.toString();
    });
  } else {
    return pathList;
  }
  return mergePath;
};

export const findValue = (
  data,
  oldPath,
  repeatStepList = [],
  editRepeatStepList = {}
) => {
  let path = createPath(oldPath, repeatStepList, editRepeatStepList);
  if (emptyField(path)) {
    return null;
  }
  return objectPath.get(data, path, null);
};

// Get data to Group or test if group have data in database
export const getData = (info, arrayIndex, documentDate, isItData = false) => {
  if (!documentDate) {
    return null;
  }
  let path = createPath(info.queryPath, arrayIndex);
  let data = objectPath.get(documentDate, path);
  if (isItData && Array.isArray(data)) {
    return data[data.length - 1];
  }
  return data;
};

export const sumFieldInObject = (array, key) => {
  let total = 0;
  array.forEach(value => {
    total += Number(value.data[key]);
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

export const isStringInstance = string =>
  typeof string === "string" || string instanceof String;

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

export const allRequiredSatisfied = (pageInfo, data, array) => {
  let returnValue = true;
  pageInfo.pages.forEach(page => {
    let newPath = page.queryPath;
    page.fields &&
      page.fields.forEach(field => {
        if (field.required) {
          let dataFields = objectPath.get(
            data,
            Array.isArray(newPath) ? createPath(newPath, array) : `${newPath}.0`
          );
          if (Array.isArray(dataFields)) {
            dataFields.forEach(dataField => {
              if (emptyField(dataField.data[field.fieldName])) {
                returnValue = false;
              }
            });
          } else if (!dataFields || !dataFields.data) {
            returnValue = false;
          } else if (emptyField(dataFields.data[field.fieldName])) {
            returnValue = false;
          }
        }
      });
  });
  return returnValue;
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
  if (emptyField(variable)) {
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
  queryVariableLabel = undefined,
  repeatStepList = [],
  editRepeatStepListVariableLabel = {},
  index = undefined
) => {
  if (!label) {
    return "";
  }
  let variableLabel = undefined;

  if (index === undefined) {
    variableLabel = findValue(
      value,
      queryVariableLabel,
      repeatStepList,
      editRepeatStepListVariableLabel
    );
  } else {
    variableLabel = index + 1;
  }
  return variableString(variableLabel, label);
};

export const getSubtext = (
  subtext,
  specSubtext,
  max,
  min,
  maxInput,
  minInput,
  unit,
  required,
  subtextMathMin,
  subtextMathMax,
  repeatStepList,
  allData
) => {
  if (subtext) {
    if (specSubtext) {
      return variableString(specSubtext, subtext);
    }
    return variableString("", subtext);
  }

  let minLocal = subtextMathMin
    ? Math[subtextMathMin](allData, repeatStepList)
    : min
    ? min
    : minInput
    ? minInput
    : "";
  let maxLocal = subtextMathMax
    ? Math[subtextMathMax](allData, repeatStepList)
    : max
    ? max
    : maxInput
    ? maxInput
    : "";

  let minString = minLocal === "" ? "" : `Min: ${minLocal}`;
  let maxString = maxLocal === "" ? "" : `Max: ${maxLocal}`;

  let unitString = unit ? `${unit} ` : " ";

  minString = minString ? minString + unitString : "";
  maxString = maxString ? maxString + unitString : "";

  let requiredString = required ? "Required" : "";

  return minString + maxString + requiredString;
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
          if (isStringInstance(query[key])) {
            let isData;
            if (!query[key].trim()) {
              isData = {};
            } else {
              isData = stringToDictionary(query[key]);
            }
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

export const validateFieldWithValue = validation => {
  Object.keys(validation).forEach(key => {
    if (!validation[key]) {
      return false;
    }
  });
  return true;
};

export const calculateMaxMin = (
  min,
  routeToSpecMin,
  editRepeatStepListMin,
  calculateMin,
  max,
  routeToSpecMax,
  editRepeatStepListMax,
  calculateMax,
  repeatStepList,
  data,
  allData
) => {
  let newMin;
  let newMax;
  if (routeToSpecMin) {
    newMin = findValue(
      data,
      routeToSpecMin,
      repeatStepList,
      editRepeatStepListMin
    );
  } else if (calculateMin) {
    min = Math[calculateMin](allData);
  } else {
    newMin = min;
  }
  if (routeToSpecMax) {
    newMax = findValue(
      data,
      routeToSpecMax,
      repeatStepList,
      editRepeatStepListMax
    );
  } else if (calculateMax) {
    max = Math[calculateMax](allData);
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
    return <Fragment key={`${index}-${firstIndex}-canvas`}>{page}</Fragment>;
  });
};

// export const mergePath = (info, arrayIndex, oldPath = null) => {
//   let path = oldPath === null ? "" : `${oldPath}.`;
//   if (info.firstQueryPath) {
//     path = `${path}${info.firstQueryPath}.${arrayIndex}.${
//       info.secondQueryPath
//     }`;
//   } else if (info.findByIndex) {
//     path = `${path}${info.queryPath}.${arrayIndex}`;
//   } else if (info.queryPath) {
//     path = `${path}${info.queryPath}`;
//   } else {
//     return null;
//   }
//   return path;
// };

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

export const batchingKey = path => {
  let splitWordInJson;
  let key;
  if (Array.isArray(path)) {
    let lastPath = path[path.length - 1];
    if (lastPath.trim()) {
      splitWordInJson = lastPath.split(/[.]+/);
      key = splitWordInJson[splitWordInJson.length - 1];
    } else {
      splitWordInJson = path[path.length - 2].split(/[.]+/);
      key = splitWordInJson[splitWordInJson.length - 1];
    }
  } else {
    splitWordInJson = path.split(/[.]+/);
    key = splitWordInJson[splitWordInJson.length - 1];
  }
  return key;
};

export const getDataToBatching = (
  fixedData,
  batchingListIds,
  path,
  arrayIndex
) => {
  let key = batchingKey(path);
  if (fixedData && batchingListIds[0]) {
    let newData = fixedData["descriptions"][0]["items"].find(
      item => item.id == batchingListIds[0]
    )[Array.isArray(path) ? createPath(path, arrayIndex) : path];
    return { [key]: newData };
  }
  return { [key]: [] };
};

export const allRequiredFinished = (data, fields) => {
  let requiredApproved = true;
  fields.forEach(field => {
    if (field.required && emptyField(data[field.fieldName])) {
      requiredApproved = false;
    }
  });
  return requiredApproved;
};

export const formDataStructure = (data, path) => {
  let lastPath = path.split(".");
  return {
    [lastPath[lastPath.length - 1]]: objectPath.get(data, path, null)
  };
};

export const getRepeatNumber = (
  data,
  repeatGroupWithQuery,
  repeatStepList,
  editRepeatStepListRepeat
) => {
  let newValue = findValue(
    data,
    repeatGroupWithQuery,
    repeatStepList,
    editRepeatStepListRepeat
  );

  if (Array.isArray(newValue)) {
    newValue = newValue.length;
  }
  return newValue;
};

export const camelCaseToNormal = string => {
  if (string === null) {
    return <div className="text-secondary">None</div>;
  } else if (typeof string === "number") {
    return String(string);
  } else if (typeof string === "string") {
    if (!string.includes(" ")) {
      string = string[0] + string.slice(1).replace(/[^A-Z](?=[A-Z])/g, "$& ");
    }
    string = string.charAt(0).toUpperCase() + string.slice(1);
    string = string.replace(/[^0-9](?=[0-9])/g, "$& ");
    string = string.replace(/\s+/g, " ");
    return string;
  }
};

export const reshapeStageSting = stage => {
  let newStage = stage;
  if (stage.split("Step")[1]) {
    newStage = stage.split("Step")[0] + "Step";
  }
  return newStage;
};

export const coatedItemOrMould = (
  category,
  leadEngineersCoatedItemJson,
  leadEngineersMouldJson
) => {
  let leadEngineersJson;
  if (removeSpace(category).toLowerCase() === "coateditem") {
    leadEngineersJson = leadEngineersCoatedItemJson;
  } else if (removeSpace(category).toLowerCase() === "mould") {
    leadEngineersJson = leadEngineersMouldJson;
  }
  return leadEngineersJson;
};

export const getStepFromStage = stage => {
  let step = null;
  if (stage.split("Step")[1]) {
    step = Number(stage.split("Step")[1]);
  }
  return step;
};
