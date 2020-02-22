import getValue from "./GetValueFromValues";

function whatTooReturn(value, decimal) {
  if (isNaN(value)) {
    return 0;
  } else {
    return value.toFixed(decimal);
  }
}

function mathCumulativeThickness(values, listIndex, decimal) {
  let previousCumulativeThickness = 0;
  if (listIndex) {
    previousCumulativeThickness = Number(
      getValue(values, "coatingLayer", listIndex - 1, "cumulativeThickness")
    );
  }
  let proposedThickness = Number(
    getValue(values, "coatingLayer", listIndex, "proposedThickness")
  );
  let layersUnique = getValue(
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
  return whatTooReturn(cumulativeThickness, decimal);
}

function mathProposedThickness(values, listIndex, decimal) {
  let partOfNumber = 0;
  let shrink = Number(getValue(values, "coatingLayer", listIndex, "shrink"));
  let actualThickness = Number(
    getValue(values, "coatingLayer", listIndex, "actualThickness")
  );
  if (shrink) {
    partOfNumber = (shrink * actualThickness) / 100;
  }
  return whatTooReturn(actualThickness + partOfNumber, decimal);
}

function mathToleranceMinPercent(values, listIndex, decimal) {
  let toleranceMin = Number(
    getValue(values, "leadEngineer", listIndex, "toleranceMin")
  );
  let orderedTotalRubberThickness = Number(
    getValue(values, "leadEngineer", listIndex, "orderedTotalRubberThickness")
  );
  return whatTooReturn(
    (toleranceMin * 100) / orderedTotalRubberThickness,
    decimal
  );
}

function mathToleranceMaxPercent(values, listIndex, decimal) {
  let toleranceMax = Number(
    getValue(values, "leadEngineer", listIndex, "toleranceMax")
  );
  let orderedTotalRubberThickness = Number(
    getValue(values, "leadEngineer", listIndex, "orderedTotalRubberThickness")
  );
  return whatTooReturn(
    (toleranceMax * 100) / orderedTotalRubberThickness,
    decimal
  );
}

const Math = {
  mathCumulativeThickness,
  mathProposedThickness,
  mathToleranceMinPercent,
  mathToleranceMaxPercent
};

export default Math;
