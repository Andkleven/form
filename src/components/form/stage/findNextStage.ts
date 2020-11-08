import stagesJson from "config/stages.json";
import {
  findValue,
  emptyField,
  isNumber,
  getProductionLine,
  getProperties
} from "../../functions/general.js";

export default (
  specData: object,
  stage: string,
  stageType: string,
  chapters: object
): object => {
  stage = stage ? stage : stagesJson.all[0];
  let productionLin = getProductionLine(stageType);
  function nextStageFormat(index: number, step: number, layer: number): object {
    nextStage = stagesJson.all[index + 1];
    if (
      stagesJson[productionLin][nextStage] &&
      stagesJson[productionLin][nextStage]["step"]
    ) {
      if (stagesJson[productionLin][nextStage]["layer"]) {
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
  while (nextStage === undefined && index < 150) {
    if (thisStage === stages[stages.length - 1]) {
      nextStage = { stage: thisStage, stageWithoutNumber: thisStage };
      break;
    }
    let crossroads;
    if (stagesJson[productionLin][thisStage]) {
      crossroads = stagesJson[productionLin][thisStage]["crossroads"];
    }
    if (crossroads) {
      query = findValue(
        specData,
        stagesJson[productionLin][crossroads]["queryPath"],
        isNumber(step) ? [step] : [],
        stagesJson[productionLin][crossroads]["editIndexList"]
      );
      if (!emptyField(query)) {
        if (crossroads.split("Step")[1] !== undefined) {
          if (crossroads.split("Layer")[1] !== undefined) {
            return {
              stage: `${crossroads.split("Step")[0]}Step${
                step + 1
              }Layer${layer}`,
              stageWithoutNumber: `${crossroads.split("Step")[0]}StepLayer`,
              number: [step, layer - 1]
            };
          }
          return {
            stage: `${crossroads}${step + 1}`,
            stageWithoutNumber: `${crossroads}`,
            number: [step]
          };
        }
        return { stage: crossroads, stageWithoutNumber: crossroads };
      }
    }
    if (
      stagesJson[productionLin][thisStage] &&
      stagesJson[productionLin][thisStage]["layer"]
    ) {
      layer += 1;
      query = findValue(
        specData,
        stagesJson[productionLin][thisStage]["queryPath"],
        [step - 1, layer - 1],
        stagesJson[productionLin][thisStage]["editIndexList"]
      );
      if (!emptyField(query)) {
        return nextStageFormat(index - 1, step, layer);
      }
    }
    thisStage = stages[index + 1];
    if (
      chapters[thisStage] &&
      chapters[thisStage].showChapter &&
      !getProperties(chapters[thisStage].showChapter, [stageType])
    ) {
      index++;
      continue;
    }
    if (emptyField(stagesJson[productionLin][thisStage])) {
      index++;
    } else if (emptyField(stagesJson[productionLin][thisStage]["queryPath"])) {
      nextStage = nextStageFormat(index, step, layer);
    } else {
      query = findValue(
        specData,
        stagesJson[productionLin][thisStage]["queryPath"],
        [step - 1, layer - 1],
        stagesJson[productionLin][thisStage]["editIndexList"]
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
