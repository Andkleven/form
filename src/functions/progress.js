import stages from "components/form/stage/stages.json";
import { camelCaseToNormal } from "functions/general";

export function progress(item) {
  if (item.stage === "done") {
    return 100;
  } else if (
    typeof item.stage === "string" &&
    stages.all.includes(item.stage)
  ) {
    const position = stages.all.findIndex(stage => stage === item.stage);
    console.log("progress -> position", position);
    const length = stages.all.length;
    console.log("progress -> length", length);
    const percentage = Math.floor(100 * (position / length));
    console.log("progress -> percentage", percentage);
    return percentage;
  }
  return 0;
}

export function displayStage(item) {
  if (item.q) {
    return "";
  } else if (
    typeof item.stage === "string" &&
    !["false", "true", ""].includes(item.stage.toLowerCase())
  ) {
    return camelCaseToNormal(item.stage);
  } else {
    return "Not started";
  }
}
