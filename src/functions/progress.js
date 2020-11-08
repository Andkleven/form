import stages from "config/stages.json";
import {
  camelCaseToNormal,
  reshapeStageSting
} from "components/functions/general";

export function progress(item) {
  if (item.stage === "done") {
    return 100;
  } else if (
    typeof item.stage === "string" &&
    stages.all.includes(reshapeStageSting(item.stage))
  ) {
    const position = stages.all.findIndex(
      stage => stage === reshapeStageSting(item.stage)
    );
    const length = stages.all.length;
    const percentage = Math.floor(100 * (position / length));
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
