import stagesJson from "./stages.json";
import { findValue, emptyField, isNumber, removeSpace } from "functions/general.js";


export default (specData: object, stage: string, geometry: string): string => {
    geometry = removeSpace(geometry).toLowerCase()
    function nextStageFormat(index: number, step: number): string {
        nextStage = stagesJson.all[index + 1]
        if (stagesJson[geometry][nextStage]["step"]){
            return `${nextStage}${step}`
        }
        return nextStage
    }

    let step = 1;
    let query;
    let thisStage = stage
    if (stage.includes("Step")) {
        step = Number(stage.split("Step")[1]);
        thisStage = stage.split("Step")[0] + "Step"
    }
    let stages = stagesJson.all
    let index = stages.indexOf(thisStage);
    let nextStage
    while (nextStage === undefined) {
        if (stagesJson[geometry][thisStage]["crossroads"]) {
            query = findValue(
                specData,
                stagesJson[geometry][stagesJson[geometry][thisStage]["crossroads"]]["queryPath"],
                isNumber(step) ? [step] : [],
                stagesJson[geometry][stagesJson[geometry][thisStage]["crossroads"]]["editIndexList"]
            );
            if (!emptyField(query)) {
                return `${stagesJson[geometry][stagesJson[geometry][thisStage]["crossroads"]]}${step + 1}`
            }
        }
        thisStage = stages[index + 1]
        if (index === stages.length - 1) {
            return "qualityControl"
        }
        if (emptyField(stagesJson[geometry][thisStage])) {
            index++
        } else if (emptyField(stagesJson[geometry][thisStage]["queryPath"])) {
            nextStage = nextStageFormat(index, step)
        } else {
            query = findValue(
                specData,
                stagesJson[geometry][thisStage]["queryPath"],
                [step-1],
                stagesJson[geometry][thisStage]["editIndexList"]
            );
            if (emptyField(query)) {
                index++
            } else {
                nextStage = nextStageFormat(index, step)

            }
        }

    }
    return nextStage
}
