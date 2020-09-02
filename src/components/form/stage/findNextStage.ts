import stagesJson from "./stages.json";
import {
  findValue,
  emptyField,
  isNumber,
  removeSpace,
  lowerCaseFirstLetter
} from "functions/general.js";

export default (specData: object, stage: string, stageType: string): object => {
  stage = stage ? stage : stagesJson.all[0];
  stageType = removeSpace(lowerCaseFirstLetter(stageType));
  function nextStageFormat(index: number, step: number, layer: number): object {
    nextStage = stagesJson.all[index + 1];
    if (
      stagesJson[stageType][nextStage] &&
      stagesJson[stageType][nextStage]["step"]
    ) {
      if (stagesJson[stageType][nextStage]["layer"]) {
        return {
          stage: `${nextStage.split("Step")[0]}Step${step}Layer${layer}`,
          stageWithoutNumber: `${nextStage.split("Step")[0]}StepLayer`,
          number: [step - 1, layer - 1]
        };
      }
      return {
        stage: `${nextStage}${step}`,
        stageWithoutNumber: `${nextStage}`,
        number: [step - 1]
      };
    }
    return { stage: nextStage, stageWithoutNumber: nextStage };
  }

  let step = 1;
  let layer = 1;
  let query;
  let thisStage = stage ? stage : stagesJson.all[0];
  if (stage.includes("Step")) {
    let stepLayer = stage.split("Step")[1];
    thisStage = stage.split("Step")[0] + "Step";
    if (stage.includes("Layer")) {
      layer = Number(stepLayer.split("Layer")[1]);
      step = Number(stepLayer.split("Layer")[0]);
      thisStage = thisStage + "Layer";
    } else {
      step = Number(stepLayer);
    }
  }

  let stages = stagesJson.all;
  let index = stages.indexOf(thisStage);
  let nextStage;
  while (nextStage === undefined) {
    if (thisStage === stages[stages.length - 1]) {
      nextStage = { stage: thisStage, stageWithoutNumber: thisStage };
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
        return {
          stage: `${crossroads}${step + 1}`,
          stageWithoutNumber: `${crossroads}`,
          number: [step, 0]
        };
      }
    }
    if (
      stagesJson[stageType][thisStage] &&
      stagesJson[stageType][thisStage]["layer"]
    ) {
      layer += 1;
      query = findValue(
        specData,
        stagesJson[stageType][thisStage]["queryPath"],
        [step - 1, layer - 1],
        stagesJson[stageType][thisStage]["editIndexList"]
      );
      if (!emptyField(query)) {
        return nextStageFormat(index - 1, step, layer);
      }
    }
    thisStage = stages[index + 1];
    if (emptyField(stagesJson[stageType][thisStage])) {
      index++;
    } else if (emptyField(stagesJson[stageType][thisStage]["queryPath"])) {
      nextStage = nextStageFormat(index, step, layer);
    } else {
      query = findValue(
        specData,
        stagesJson[stageType][thisStage]["queryPath"],
        [step - 1, layer - 1],
        stagesJson[stageType][thisStage]["editIndexList"]
      );
      if (emptyField(query)) {
        index++;
      } else {
        nextStage = nextStageFormat(index, step, layer);
      }
    }
  }
  return nextStage;
};
