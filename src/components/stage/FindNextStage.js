import "FindNextStage" from "components/stage/FindNextStage.json";
import "StagesJson" from "components/stage/Stages.json";
import {stringToDictionary, emptyObject} from"components/Functions";
import objectPath from "object-path";

const findNextStage = (speckData, geometry, nextStage) => {
  let stageCriteria = StagesJson[geometry][nextStage]
  if (emptyObject(stageCriteria)) {
    return true
  }
  let query = objectPath.get(speckData, stageCriteria.queryPath, null)
  if (query === null) {
    return false
  } else if (!stageCriteria.fieldPath.trim()) {
    return true
  }
  let field = stringToDictionary(query)[stageCriteria.fieldPath]
  if (field !== undefined) {
    return true
  }
  return false
}

export default (speckData, stage, geometry) => {
  let index = StagesJson.all.indexOf(stage)
  let nextStage;
  for (index < StagesJson.all.length; index++;) {
    nextStage = StagesJson.all[index]
    if (findNextStage(speckData, geometry, nextStage)) { 
      return nextStage 
    }
  }
  return null
};
