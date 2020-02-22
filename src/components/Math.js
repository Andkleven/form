import GetValue from "./GetValueFromValues";

const whatTooReturn = (value, decimal) => {
  if (isNaN(value)) {
    return 0;
  } else {
    return value.toFixed(decimal);
  }
}

const mathCumulativeThickness = (values, listIndex, decimal) => {
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
  return whatTooReturn(cumulativeThickness, decimal);
}

const mathProposedThickness = (values, listIndex, decimal) => {
  let partOfNumber = 0;
  let shrink = Number(GetValue(values, "coatingLayer", listIndex, "shrink"));
  let actualThickness = Number(
    GetValue(values, "coatingLayer", listIndex, "actualThickness")
  );
  if (shrink) {
    partOfNumber = (shrink * actualThickness) / 100;
  }
  return whatTooReturn(actualThickness + partOfNumber, decimal);
}

const mathToleranceMinPercent = (values, listIndex, decimal) => {
  let toleranceMin = Number(
    GetValue(values, "leadEngineer", listIndex, "toleranceMin")
  );
  let orderedTotalRubberThickness = Number(
    GetValue(values, "leadEngineer", listIndex, "orderedTotalRubberThickness")
  );
  return whatTooReturn(
    (toleranceMin * 100) / orderedTotalRubberThickness,
    decimal
  );
}

const mathToleranceMaxPercent = (values, listIndex, decimal) => {
  let toleranceMax = Number(
    GetValue(values, "leadEngineer", listIndex, "toleranceMax")
  );
  let orderedTotalRubberThickness = Number(
    GetValue(values, "leadEngineer", listIndex, "orderedTotalRubberThickness")
  );
  return whatTooReturn(
    (toleranceMax * 100) / orderedTotalRubberThickness,
    decimal
  );
}

export default Maht = {
  mathCumulativeThickness,
  mathProposedThickness,
  mathToleranceMinPercent,
  mathToleranceMaxPercent
};

