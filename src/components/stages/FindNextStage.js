import StagesJson from "./Stages.json";
import { findValue } from "components/Functions";

export default (speckData, stage, geometry) => {
  const findNextStage = (speckData, geometry, nextStage) => {
    let stageCriteria = StagesJson[geometry][nextStage];
    if ([undefined, null, ""].includes(stageCriteria)) {
      return true;
    }
    let query = findValue(speckData, stageCriteria.queryPath);
    if ([undefined, null, ""].includes(query)) {
      return true;
    }
    return false;
  };
  let index = StagesJson.all.indexOf(stage);
  let nextStage;
  for (index < StagesJson.all.length; index++; ) {
    nextStage = StagesJson.all[index];
    if (findNextStage(speckData, geometry, nextStage)) {
      return nextStage;
    }
  }
  return null;
};
