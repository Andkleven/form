import React from "react";
import objectPath from "object-path";
import { Fragment } from "react";

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
    if (Array.isArray(newPath)) {
      newPath = newPath.slice(0, array.length + 1);
    }
    page.fields &&
      page.fields.forEach(field => {
        if (field.required) {
          let dataFields = objectPath.get(
            data,
            createPath(newPath, array).toString()
          );
          if (Array.isArray(dataFields)) {
            dataFields.forEach(dataField => {
              if (emptyField(dataField.data[field.fieldName])) {
                // console.log(
                //   dataFields,
                //   createPath(newPath, array),
                //   dataField.data[field.fieldName],
                //   1
                // );
                returnValue = false;
              }
            });
          } else if (!dataFields || !dataFields.data) {
            // console.log(dataFields, createPath(newPath, array), 2);
            returnValue = false;
          } else if (emptyField(dataFields.data[field.fieldName])) {
            // console.log(
            //   dataFields,
            //   createPath(newPath, array),
            //   dataFields.data[field.fieldName],
            //   3
            // );
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
  SpeckSubtext,
  max,
  min,
  maxInput,
  minInput,
  unit,
  required
) => {
  if (subtext) {
    if (SpeckSubtext) {
      return variableString(SpeckSubtext, subtext);
    }
    return variableString("", subtext);
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
  editRepeatStepListMin,
  max,
  routToSpeckMax,
  editRepeatStepListMax,
  repeatStepList,
  data
) => {
  let newMin;
  let newMax;
  if (routToSpeckMin) {
    newMin = findValue(
      data,
      routToSpeckMin,
      repeatStepList,
      editRepeatStepListMin
    );
  } else {
    newMin = min;
  }
  if (routToSpeckMax) {
    newMax = findValue(
      data,
      routToSpeckMax,
      repeatStepList,
      editRepeatStepListMax
    );
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

export const getDataToBatching = (fixedData, batchingListIds, json) => {
  let splitWordInJson = json.split(/[.]+/);
  let key = splitWordInJson[splitWordInJson.length - 1];
  if (fixedData && batchingListIds[0]) {
    let newData = fixedData["descriptions"][0]["items"].find(
      item => item.id == batchingListIds[0]
    )[json];
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

export const formDataStructure = (json, data, path) => {
  let lastPath = json[path].split(".");
  return {
    [lastPath[lastPath.length - 1]]: objectPath.get(data, json[path], null)
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
  } else {
    if (!string.includes(" ")) {
      string = string[0] + string.slice(1).replace(/([A-Z])/g, " $1");
    }
    string = string.replace(/([0-9])/g, " $1");
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string;
  }
};
