import React, { useRef, useEffect } from "react";
import objectPath from "object-path";
import Math from "components/form/functions/math";
import { ignoreRequiredField } from "config/const";
import stages from "components/form/stage/stages.json";

export const stringToDictionary = data => {
  if (typeof data === "string") {
    return JSON.parse(data.replace(/'/g, '"'));
  }
};

export const emptyField = field =>
  [null, undefined, "", "None", 0, false].includes(field);

export const fieldNotFilledOut = field =>
  [null, undefined, "", false].includes(field);

export const isNumber = number => typeof number === "number";

export const isNumberAndNotNaN = number =>
  typeof number === "number" && !isNaN(number);

export const writeChapter = (
  allWaysShow,
  editChapter,
  thisChapter,
  finalChapter
) => {
  if (allWaysShow) {
    return true;
  } else if (editChapter) {
    if (thisChapter === editChapter) {
      return true;
    } else {
      return false;
    }
  } else if (thisChapter === finalChapter) {
    return true;
  } else {
    return false;
  }
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

export const sumFieldInObject = (array, key) => {
  let total = 0;
  array.forEach(value => {
    total += Number(value.data[key]);
  });
  return total;
};

export const isStringInstance = string =>
  typeof string === "string" || string instanceof String;

export const allFalse = element => !element;

export const allTrue = element => element;

export const allZeroOrNaN = element => element === 0 || isNaN(element);

export const removeSpace = string => string.replace(/\s/g, "");
export const allRequiredSatisfied = (pageInfo, data, array, specData) => {
  let returnValue = true;
  pageInfo.pages.forEach((page, index) => {
    let newPath = page.queryPath;
    let allFieldMissing = [];
    let dataFields = objectPath.get(
      data,
      Array.isArray(newPath) ? createPath(newPath, array) : newPath
    );
    if (dataFields && !page.repeat && !Array.isArray(page.queryPath)) {
      dataFields = dataFields[0];
    }
    page.fields &&
      page.fields.forEach(field => {
        if (field.required) {
          if (Array.isArray(dataFields)) {
            dataFields.forEach(dataField => {
              if (
                fieldNotFilledOut(dataField.data[field.fieldName]) &&
                !dataField.data[field.fieldName + ignoreRequiredField] &&
                ((field.showFieldSpecPath &&
                  specData[field.showFieldSpecPath]) ||
                  field.showFieldSpecPath === undefined)
              ) {
                if (
                  field.showFieldSpecPath &&
                  specData[field.showFieldSpecPath]
                ) {
                  returnValue = false;
                }
              }
            });
          } else if (!dataFields || !dataFields.data) {
            returnValue = false;
          } else if (
            fieldNotFilledOut(dataFields.data[field.fieldName]) &&
            !dataFields.data[field.fieldName + ignoreRequiredField]
          ) {
            returnValue = false;
          }
        } else if (
          !Array.isArray(dataFields) &&
          field.fieldName &&
          (dataFields === undefined ||
            dataFields.data === undefined ||
            dataFields.data[field.fieldName] === undefined)
        ) {
          allFieldMissing.push(false);
        } else {
          allFieldMissing.push(true);
        }
      });
    if (allFieldMissing.every(allFalse) && allFieldMissing.length !== 0) {
      returnValue = false;
    }
  });
  return returnValue;
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
  unit,
  subtextMathMin,
  subtextMathMax,
  repeatStepList,
  allData
) => {
  let minLocal = subtextMathMin
    ? Math[subtextMathMin](allData, repeatStepList)
    : isNumber(min)
    ? min
    : "";
  let maxLocal = subtextMathMax
    ? Math[subtextMathMax](allData, repeatStepList)
    : isNumber(max)
    ? max
    : "";

  let minString = minLocal === "" ? "" : `Min: ${minLocal}`;
  let maxString = maxLocal === "" ? "" : `Max: ${maxLocal}`;

  let unitString = unit ? `${unit} ` : " ";

  minString = minString ? minString + unitString : "";
  maxString = maxString ? maxString + unitString : "";

  if (subtext) {
    if (specSubtext) {
      subtext = variableString(specSubtext, subtext);
    }
    subtext = variableString("", subtext);
  }
  return minString + maxString + (subtext ? subtext : "");
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
          let isData;
          if (isStringInstance(query[key])) {
            if (!query[key].trim()) {
              isData = {};
            } else {
              isData = stringToDictionary(query[key]);
            }
          } else if (query[key] === null || query[key] === undefined) {
            isData = {};
          }
          if (isData) {
            objectPath.set(newObject, path, isData);
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

export const getBatchingData = (query, batching) => {
  if (query) {
    let newObject = {};
    const objectifyEntries = (query, oldPath = null) => {
      let path;
      Object.keys(query).forEach(key => {
        path = oldPath === null ? key : oldPath + "." + key;
        if (Array.isArray(query[key])) {
          query[key].forEach((value, index) => {
            objectifyEntries(value, path + "." + index.toString());
          });
        } else if (key === "data") {
          let data = {};
          Object.keys(batching).forEach(fieldName => {
            if (
              ![null, undefined].includes(query.data[fieldName]) &&
              ![null, undefined].includes(batching[fieldName])
            ) {
              data[fieldName] = query.data[fieldName];
            }
          });
          if (Object.keys(data).length !== 0) {
            objectPath.set(newObject, path, { ...data });
          }
        }
      });
    };
    objectifyEntries(query);
    return newObject;
  }
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
    newMin = Number(
      findValue(data, routeToSpecMin, repeatStepList, editRepeatStepListMin)
    );
  } else if (calculateMin) {
    newMin = Number(Math[calculateMin](allData, data, repeatStepList));
  } else {
    newMin = min;
  }
  if (routeToSpecMax) {
    newMax = Number(
      findValue(data, routeToSpecMax, repeatStepList, editRepeatStepListMax)
    );
  } else if (calculateMax) {
    newMax = Number(Math[calculateMax](allData, data, repeatStepList));
  } else {
    newMax = max;
  }
  return { min: newMin, max: newMax };
};

export const stringifyQuery = (query, removeEmptyField = false) => {
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
        let object = query[key];
        if (removeEmptyField) {
          removeEmptyValueFromObject(object);
        }
        let isData = JSON.stringify(object);
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
  descriptionId,
  repeatStepList,
  batchingData
) => {
  let key = batchingKey(path);
  if (fixedData && batchingListIds[0]) {
    let newData = fixedData.projects[0].descriptions
      .find(description => Number(description.id) === Number(descriptionId))
      .items.find(item => Number(item.id) === Number(batchingListIds[0]));
    newData = objectPath.get(
      newData,
      Array.isArray(path) ? createPath(path, repeatStepList) : path
    );
    return getBatchingData({ [key]: newData }, batchingData);
  }
  return { [key]: [] };
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
    if (stage.split("Layer")[1]) {
      newStage = newStage + "Layer";
    }
  }
  return newStage;
};

export function lowerCaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function coatedItemOrMould(
  category,
  coatedItemJson,
  mouldJson,
  packerJson
) {
  let json;
  switch (lowerCaseFirstLetter(removeSpace(category.toString()))) {
    case "coatedItem":
      json = coatedItemJson;
      break;
    case "mould":
      json = mouldJson;
      break;
    case "packer":
      json = packerJson;
      break;
    default:
      break;
  }
  return json;
}

export function productionLineJson(productionLine, coatingJson, packerJson) {
  let json;
  switch (lowerCaseFirstLetter(removeSpace(productionLine.toString()))) {
    case "coating":
      json = coatingJson;
      break;
    case "packer":
      json = packerJson;
      break;
    default:
      break;
  }
  return json;
}

export const getStepFromStage = stage => {
  let step = null;
  if (stage.split("Step")[1]) {
    step = Number(stage.split("Step")[1]);
  }
  return step;
};

export function getRepeatStepList(repeatStepList, index) {
  return repeatStepList ? [...repeatStepList, index] : [index];
}

export function isLastCharacterNumber(str) {
  return !isNaN(Number(str.slice(-1)));
}

export function getBatchingJson(
  geometry,
  operatorJson,
  allBatchingJson,
  stage
) {
  let batchingJson = allBatchingJson[reshapeStageSting(stage)];
  batchingJson.document.chapters = [
    operatorJson.chapters[reshapeStageSting(stage)]
  ];
  return batchingJson;
}

export function getStartStage(geometry, item) {
  let stage = undefined;
  switch (geometry) {
    case "Coated Item":
      if (
        item &&
        objectPath.get(item, "leadEngineers.0.data.measurementPoint") === 0
      ) {
        stage = "steelPreparation1";
        break;
      }
      stage = Object.keys(stages["coatedItem"])[0];
      break;
    case "Mould":
      stage = Object.keys(stages["mould"])[0];
      break;
    default:
      break;
  }
  return stage;
}

export function getSpecComment(
  specData,
  routeToSpecMax = null,
  routeToSpecMin = null,
  specValueList = null,
  repeatStepList = [],
  editRepeatStepValueList = {}
) {
  let comment = "";
  const getComment = path => {
    comment = objectPath.get(
      specData,
      `${createPath(path, repeatStepList, editRepeatStepValueList)}Comment`,
      ""
    );
  };
  if (specValueList) {
    getComment(specValueList);
  } else if (routeToSpecMax) {
    getComment(routeToSpecMax);
  } else if (routeToSpecMin) {
    getComment(routeToSpecMin);
  }
  return comment;
}

export function getProperties(value, jsonVariables = []) {
  if (
    typeof value === "object" &&
    value !== null &&
    !(value instanceof Array)
  ) {
    for (let variable of jsonVariables) {
      if (value[removeSpace(lowerCaseFirstLetter(variable))] !== undefined) {
        return value[removeSpace(lowerCaseFirstLetter(variable))];
      }
    }
    return "";
  } else if (value === undefined) {
    return "";
  } else {
    return value;
  }
}

export function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log("Changed props:", changedProps);
    }
    prev.current = props;
  });
}
