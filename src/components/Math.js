import GetValue from "./GetValue";
import { allFalse } from "./Function";

function whatTooReturn(value, decimal, array = [true]) {
  if (array.every(allFalse)) {
    return null;
  } else {
    return value.toFixed(decimal);
  }
}

function mathCumulativeThickness(values, repeatStep, decimal) {
  let previousCumulativeThickness = 0;
  if (repeatStep) {
    previousCumulativeThickness = Number(
      GetValue(values, "coatingLayer", repeatStep - 1, "cumulativeThickness")
    );
  }
  let proposedThickness = Number(
    GetValue(values, "coatingLayer", repeatStep, "proposedThickness")
  );
  let layersUnique = GetValue(
    values,
    "coatingLayer",
    repeatStep,
    "layersUnique"
  );
  let cumulativeThickness = 0;
  if (layersUnique) {
    cumulativeThickness = previousCumulativeThickness;
  } else {
    cumulativeThickness = previousCumulativeThickness + proposedThickness;
  }
  return whatTooReturn(cumulativeThickness, decimal, [
    previousCumulativeThickness,
    proposedThickness,
    layersUnique
  ]);
}

function mathProposedThickness(values, repeatStep, decimal) {
  let partOfNumber = 0;
  let shrink = Number(GetValue(values, "coatingLayer", repeatStep, "shrink"));
  let actualThickness = Number(
    GetValue(values, "coatingLayer", repeatStep, "actualThickness")
  );
  if (shrink) {
    partOfNumber = (shrink * actualThickness) / 100;
  }

  return whatTooReturn(actualThickness + partOfNumber, decimal, [
    shrink,
    actualThickness
  ]);
}

function mathToleranceMinPercent(values, repeatStep, decimal) {
  let toleranceMin = Number(
    GetValue(values, "leadEngineer", repeatStep, "toleranceMin")
  );
  let orderedTotalRubberThickness = Number(
    GetValue(values, "leadEngineer", repeatStep, "orderedTotalRubberThickness")
  );
  return whatTooReturn(
    (toleranceMin * 100) / orderedTotalRubberThickness,
    decimal,
    [toleranceMin, orderedTotalRubberThickness]
  );
}

function mathToleranceMaxPercent(values, repeatStep, decimal) {
  let toleranceMax = Number(
    GetValue(values, "leadEngineer", repeatStep, "toleranceMax")
  );
  let orderedTotalRubberThickness = Number(
    GetValue(values, "leadEngineer", repeatStep, "orderedTotalRubberThickness")
  );
  return whatTooReturn(
    (toleranceMax * 100) / orderedTotalRubberThickness,
    decimal,
    [toleranceMax, orderedTotalRubberThickness]
  );
}

const Math = {
  mathCumulativeThickness,
  mathProposedThickness,
  mathToleranceMinPercent,
  mathToleranceMaxPercent
};

export default Math;
