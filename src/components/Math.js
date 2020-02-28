import GetValue from "./GetValue";
import { allZeroOrNaN } from "./Functions";

function whatTooReturn(value, decimal, array = [true]) {
  if (array.every(allZeroOrNaN)) {
    return null;
  } else {
    return value.toFixed(decimal);
  }
}

function mathCumulativeThicknes(values, repeatStep, decimal) {
  let previousCumulativeThicknes = 0;
  if (repeatStep) {
    previousCumulativeThicknes = Number(
      GetValue(values, "coatingLayers", repeatStep - 1, "cumulativeThicknes")
    );
  }
  let proposedThicknes = Number(
    GetValue(values, "coatingLayers", repeatStep, "proposedThicknes")
  );
  let layersUnique = GetValue(
    values,
    "coatingLayers",
    repeatStep,
    "layersUnique"
  );
  let cumulativeThicknes = 0;
  if (layersUnique) {
    cumulativeThicknes = previousCumulativeThicknes;
  } else {
    cumulativeThicknes = previousCumulativeThicknes + proposedThicknes;
  }
  return whatTooReturn(cumulativeThicknes, decimal, [
    previousCumulativeThicknes,
    proposedThicknes,
    layersUnique
  ]);
}

function mathProposedThicknes(values, repeatStep, decimal) {
  let partOfNumber = 0;
  let shrink = Number(GetValue(values, "coatingLayers", repeatStep, "shrink"));
  let actualThicknes = Number(
    GetValue(values, "coatingLayers", repeatStep, "actualThicknes")
  );
  if (shrink) {
    partOfNumber = (shrink * actualThicknes) / 100;
  }

  return whatTooReturn(actualThicknes + partOfNumber, decimal, [
    shrink,
    actualThicknes
  ]);
}

function mathToleranceMinPercent(values, repeatStep, decimal) {
  let toleranceMin = Number(
    GetValue(values, "leadEngineer", repeatStep, "toleranceMin")
  );
  let orderedTotalRubberThicknes = Number(
    GetValue(values, "leadEngineer", repeatStep, "orderedTotalRubberThicknes")
  );
  return whatTooReturn(
    (toleranceMin * 100) / orderedTotalRubberThicknes,
    decimal,
    [toleranceMin, orderedTotalRubberThicknes]
  );
}

function mathToleranceMaxPercent(values, repeatStep, decimal) {
  let toleranceMax = Number(
    GetValue(values, "leadEngineer", repeatStep, "toleranceMax")
  );
  let orderedTotalRubberThicknes = Number(
    GetValue(values, "leadEngineer", repeatStep, "orderedTotalRubberThicknes")
  );
  return whatTooReturn(
    (toleranceMax * 100) / orderedTotalRubberThicknes,
    decimal,
    [toleranceMax, orderedTotalRubberThicknes]
  );
}

const Math = {
  mathCumulativeThicknes,
  mathProposedThicknes,
  mathToleranceMinPercent,
  mathToleranceMaxPercent
};

export default Math;
