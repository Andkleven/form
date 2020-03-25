import StagesJson from "./Stages.json";
import { findValue } from "components/Functions";

export default (speckData, stage, geometry) => {
  let stageSplit = stage.split("Step");
  let newStage = stageSplit[1] ? stageSplit[0] + "Step" : stageSplit[0];
  const findNextStageInLoop = (geometry, nextStage, number) => {
    for (index < StagesJson.all.length; index++; ) {
      if (findNextStage(geometry, nextStage, number)) {
        return `${nextStage}-${number}`;
      } else {
        return "loop normal";
      }
    }
    return "loop again";
  };
  const testForStage = (index, nextStage) => {
    for (index < StagesJson.all.length; index++; ) {
      nextStage = StagesJson.all[index];
      if (findNextStage(geometry, nextStage)) {
        return nextStage;
      } else {
        return null;
      }
    }
  };
  const findNextStage = (geometry, nextStage, number = null) => {
    let stageCriteria = StagesJson[geometry][nextStage];
    if ([undefined, null, ""].includes(stageCriteria.queryPath)) {
      return true;
    }
    let query = findValue(
      speckData,
      stageCriteria.queryPath,
      number,
      stageCriteria.editIndexList
    );
    if ([undefined, null, ""].includes(query)) {
      return false;
    }
    return true;
  };
  let index = StagesJson.all.indexOf(newStage);
  let nextStage;
  if (index === -1) {
    nextStage = "loop again";
    let index = StagesJson.all[6].indexOf(newStage);
    nextStage = StagesJson.all[6][index];
    let number = stageSplit[1];
    while (nextStage === "loop again" && number < 5) {
      nextStage = findNextStageInLoop(geometry, nextStage, number);
      number += 1;
    }
    if (nextStage === "loop normal") {
      return testForStage(6, StagesJson.all[6]);
    } else {
      return nextStage;
    }
  } else {
    return testForStage(index, nextStage);
  }
};
