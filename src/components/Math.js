import GetValue from "./GetValue";
import { allFalse } from "./Function";

function whatTooReturn(value, decimal, array = [true]) {
  if (array.every(allFalse)) {
    return null;
  } else {
    return value.toFixed(decimal);
  }
}

function mathCumulativeThickness(values, listIndex, decimal) {
  let previousCumulativeThickness = 0;
  if (listIndex) {
    previousCumulativeThickness = Number(
      GetValue(values, "coatingLayer", listIndex - 1, "cumulativeThickness")
    );
  }
  let proposedThickness = Number(
    GetValue(values, "coatingLayer", listIndex, "proposedThickness")
  );
  let layersUnique = GetValue(
    values,
    "coatingLayer",
    listIndex,
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

function mathProposedThickness(values, listIndex, decimal) {
  let partOfNumber = 0;
  let shrink = Number(GetValue(values, "coatingLayer", listIndex, "shrink"));
  let actualThickness = Number(
    GetValue(values, "coatingLayer", listIndex, "actualThickness")
  );
  if (shrink) {
    partOfNumber = (shrink * actualThickness) / 100;
  }

  return whatTooReturn(actualThickness + partOfNumber, decimal, [
    shrink,
    actualThickness
  ]);
}

function mathToleranceMinPercent(values, listIndex, decimal) {
  let toleranceMin = Number(
    GetValue(values, "leadEngineer", listIndex, "toleranceMin")
  );
  let orderedTotalRubberThickness = Number(
    GetValue(values, "leadEngineer", listIndex, "orderedTotalRubberThickness")
  );
  return whatTooReturn(
    (toleranceMin * 100) / orderedTotalRubberThickness,
    decimal,
    [toleranceMin, orderedTotalRubberThickness]
  );
}

function mathToleranceMaxPercent(values, listIndex, decimal) {
  let toleranceMax = Number(
    GetValue(values, "leadEngineer", listIndex, "toleranceMax")
  );
  let orderedTotalRubberThickness = Number(
    GetValue(values, "leadEngineer", listIndex, "orderedTotalRubberThickness")
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
