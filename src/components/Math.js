import { allZeroOrNaN, getValue } from "./Functions";

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
      getValue(values, "coatingLayer", repeatStep - 1, "cumulativeThicknes")
    );
  }
  let proposedThicknes = Number(
    getValue(values, "coatingLayer", repeatStep, "proposedThicknes")
  );
  let layersUnique = getValue(
    values,
    "coatingLayer",
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
  let shrink = Number(getValue(values, "coatingLayer", repeatStep, "shrink"));
  let actualThicknes = Number(
    getValue(values, "coatingLayer", repeatStep, "actualThicknes")
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
    getValue(values, "leadEngineer", repeatStep, "toleranceMin")
  );
  let orderedTotalRubberThicknes = Number(
    getValue(values, "leadEngineer", repeatStep, "orderedTotalRubberThicknes")
  );
  return whatTooReturn(
    (toleranceMin * 100) / orderedTotalRubberThicknes,
    decimal,
    [toleranceMin, orderedTotalRubberThicknes]
  );
}

function mathToleranceMaxPercent(values, repeatStep, decimal) {
  let toleranceMax = Number(
    getValue(values, "leadEngineer", repeatStep, "toleranceMax")
  );
  let orderedTotalRubberThicknes = Number(
    getValue(values, "leadEngineer", repeatStep, "orderedTotalRubberThicknes")
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
