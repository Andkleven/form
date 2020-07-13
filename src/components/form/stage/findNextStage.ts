import stagesJson from "./stages.json";
import {
  findValue,
  emptyField,
  isNumber,
  removeSpace
} from "functions/general.js";

export default (specData: object, stage: string, stageType: string): string => {
  stage = stage ? stage : stagesJson.all[0];
  stageType = removeSpace(stageType).toLowerCase();
  function nextStageFormat(index: number, step: number): string {
    nextStage = stagesJson.all[index + 1];
    if (
      stagesJson[stageType][nextStage] &&
      stagesJson[stageType][nextStage]["Step"]
    ) {
      return `${nextStage}${step}`;
    }
    return nextStage;
  }

  let step = 1;
  let query;
  let thisStage = stage ? stage : stagesJson.all[0];
  if (stage.includes("Step")) {
    step = Number(stage.split("Step")[1]);
    thisStage = stage.split("Step")[0] + "Step";
  }
  let stages = stagesJson.all;
  let index = stages.indexOf(thisStage);
  let nextStage;
  while (nextStage === undefined) {
    if (thisStage === stages[stages.length - 1]) {
      nextStage = thisStage;
      break;
    }
    let crossroads;
    if (stagesJson[stageType][thisStage]) {
      crossroads = stagesJson[stageType][thisStage]["crossroads"];
    }
    if (crossroads) {
      query = findValue(
        specData,
        stagesJson[stageType][crossroads]["queryPath"],
        isNumber(step) ? [step] : [],
        stagesJson[stageType][crossroads]["editIndexList"]
      );
      if (!emptyField(query)) {
        return `${crossroads}${step + 1}`;
      }
    }
    thisStage = stages[index + 1];
    if (emptyField(stagesJson[stageType][thisStage])) {
      index++;
    } else if (emptyField(stagesJson[stageType][thisStage]["queryPath"])) {
      nextStage = nextStageFormat(index, step);
    } else {
      query = findValue(
        specData,
        stagesJson[stageType][thisStage]["queryPath"],
        [step - 1],
        stagesJson[stageType][thisStage]["editIndexList"]
      );
      if (emptyField(query)) {
        index++;
      } else {
        nextStage = nextStageFormat(index, step);
      }
    }
  }
  return nextStage;
};
