import stagesJson from "./Stages.json";
import {
  findValue,
  isNumber,
  emptyField,
  removeSpace
} from "components/Functions";

export default (speckData, stage, geometry) => {
  geometry = removeSpace(geometry).toLowerCase();
  console.log(geometry);
  let stageSplit = stage.split("Step");
  let newStage = stageSplit[1] ? stageSplit[0] + "Step" : stageSplit[0];
  console.log(newStage, 1);
  const findNextStageInLoop = (indexStart, geometry, number, nextStage) => {
    while (number < 5) {
      for (index = indexStart; index < stagesJson.all.length; index++) {
        nextStage = stagesJson.all[6][index];
        console.log(stagesJson);
        console.log(nextStage, "hhhhh");
        if (findNextStage(geometry, nextStage, number)) {
          return `${nextStage}-${number}`;
        } else if (index === stagesJson.all.length - 1) {
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
      if (findNextStage(geometry, nextStage)) {
        return nextStage;
      }
    }
    return "jaja";
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
      isNumber(number) ? number - 1 : [],
      stageCriteria.editIndexList
    );
    if (emptyField(query)) {
      return false;
    }
    return true;
  };
  let index = stagesJson.all.indexOf(newStage);
  let nextStage;
  if (index === -1 || index === 4) {
    console.log(2);
    let arrayInArray = stagesJson.all[6];
    let number = stageSplit[1];
    if (index === 4) {
      index = 0;
    } else if (number === arrayInArray.length - 1) {
      index = arrayInArray[0];
      number += 1;
    } else {
      index = arrayInArray.indexOf(newStage) + 1;
    }
    nextStage = findNextStageInLoop(index, geometry, number, nextStage);
    if (nextStage === "loop normal") {
      let a = testForStage(6);
      console.log(a, 2);
      return a;
    } else {
      console.log(nextStage, 4);
      return nextStage;
    }
  } else {
    let b = testForStage(index + 1);
    console.log(b, 5);
    return b;
  }
};
