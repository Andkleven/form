import stagesJson from "./Stages.json";
import { findValue, emptyField, removeSpace } from "components/Functions";

export default (speckData, stage, geometry) => {
  geometry = removeSpace(geometry).toLowerCase();
  let stageSplit = stage.split("Step");
  let newStage = stageSplit[1] ? stageSplit[0] + "Step" : stageSplit[0];
  const findNextStageInLoop = (indexStart, geometry, number, nextStage) => {
    while (number < 5) {
      for (index = indexStart; index < stagesJson.all[6].length; index++) {
        nextStage = stagesJson.all[6][index];
        if (findNextStage(geometry, nextStage, number)) {
          return `${nextStage}${number}`;
        } else if (index === stagesJson.all[6].length - 1) {
          return "loop normal";
        }
      }
      index = 0;
      number += 1;
    }
  };
  const testForStage = indexStart => {
    for (index = indexStart; index < stagesJson.all.length; index++) {
      nextStage = stagesJson.all[index];
      if (Array.isArray(nextStage)) {
        nextStage = findNextStageInLoop(
          0,
          geometry,
          1,
          nextStage[0].split("Step")[0] + "Step"
        );
        if (nextStage !== "loop normal") {
          return nextStage;
        }
      } else if (findNextStage(geometry, nextStage)) {
        return nextStage;
      }
    }
    return "Anders er best";
  };
  const findNextStage = (geometry, nextStage, number = null) => {
    console.log(nextStage);
    let stageCriteria = stagesJson[geometry][nextStage];
    if (emptyField(stageCriteria.queryPath)) {
      return true;
    }
    let query = findValue(
      speckData,
      stageCriteria.queryPath,
      number === null ? [] : [number - 1],
      stageCriteria.editIndexList
    );
    if (emptyField(query)) {
      return false;
    }
    return true;
  };
  let index = stagesJson.all.indexOf(newStage);
  let nextStage;
  if (index === -1 || index === 5) {
    let arrayInArray = stagesJson.all[6];
    let number = stageSplit[1];
    if (index === 5) {
      index = 0;
      number = 1;
    } else if (number === arrayInArray.length - 1) {
      index = arrayInArray[0];
      number += 1;
    } else {
      index = arrayInArray.indexOf(newStage) + 1;
    }
    nextStage = findNextStageInLoop(index, geometry, number, nextStage);
    if (nextStage === "loop normal") {
      return testForStage(7);
    } else {
      return nextStage;
    }
  } else {
    return testForStage(index + 1);
  }
};
