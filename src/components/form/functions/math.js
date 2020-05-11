import { allZeroOrNaN, findValue } from "../../../functions/general";

const whatTooReturn = (value, decimal, array = [true]) => {
  if (array.every(allZeroOrNaN)) {
    return null;
  } else {
    return value.toFixed(decimal);
  }
};

const qualityControlMeasurementPointMould = (allData, tolerance, decimal) => {
  let orderedTotalRubberThickness = findValue(
    allData,
    `items.0.leadEngineers.0.data.orderedTotalRubberThickness`
  );
  let value = orderedTotalRubberThickness + tolerance;

  return whatTooReturn(value, decimal, [
    orderedTotalRubberThickness,
    tolerance
  ]);
};

const qualityControlMeasurementPointMouldMin = (allData, repeatStepList) => {
  let toleranceMin = Number(
    findValue(allData, `items.0.leadEngineers.0.data.toleranceMin`)
  );
  return qualityControlMeasurementPointMould(
    allData,
    repeatStepList,
    toleranceMin,
    1
  );
};
const qualityControlMeasurementPointMouldMax = (allData, repeatStepList) => {
  let toleranceMax = Number(
    findValue(allData, `items.0.leadEngineers.0.data.toleranceMax`)
  );
  return qualityControlMeasurementPointMould(
    allData,
    repeatStepList,
    toleranceMax,
    1
  );
};

const qualityControlMeasurementPointCoatingItem = (
  allData,
  repeatStepList,
  tolerance,
  decimal
) => {
  let measurementPointActual = Number(
    findValue(
      allData,
      `items.0.leadEngineers.0.measurementPointActualTdvs.${repeatStepList[0]}.data.measurementPointActual`
    )
  );

  let targetDescriptionValue = findValue(
    allData,
    `items.0.leadEngineers.0.data.targetDescriptionValue`
  );
  let value;
  if (targetDescriptionValue.toLowerCase() === "od") {
    value = measurementPointActual + tolerance;
  } else if (targetDescriptionValue.toLowerCase() === "id") {
    value = measurementPointActual - tolerance;
  }
  return whatTooReturn(value, decimal, [
    measurementPointActual,
    tolerance,
    targetDescriptionValue
  ]);
};

const qualityControlMeasurementPointCoatingItemMin = (
  allData,
  repeatStepList
) => {
  let toleranceMin = Number(
    findValue(allData, `items.0.leadEngineers.0.data.toleranceMin`)
  );
  return qualityControlMeasurementPointCoatingItem(
    allData,
    repeatStepList,
    toleranceMin,
    1
  );
};
const qualityControlMeasurementPointCoatingItemMax = (
  allData,
  repeatStepList
) => {
  let toleranceMax = Number(
    findValue(allData, `items.0.leadEngineers.0.data.toleranceMax`)
  );
  return qualityControlMeasurementPointCoatingItem(
    allData,
    repeatStepList,
    toleranceMax,
    1
  );
};

const mathCumulativeThickness = (values, repeatStepList, decimal) => {
  let previousCumulativeThickness = 0;
  let previousLayers = 0;
  if (repeatStepList[0] && repeatStepList[1] === 0) {
    const sumProposedThickness = data => {
      previousLayers += Number(data.data.actualThickness);
    };
    for (let i = 0; i < repeatStepList[0]; i++) {
      let coatingLayers = findValue(
        values,
        `leadEngineers.0.vulcanizationSteps.${i}.coatingLayers`
      );
      coatingLayers.forEach(data => sumProposedThickness(data));
    }
  }
  if (repeatStepList[1]) {
    previousCumulativeThickness = Number(
      findValue(
        values,
        `leadEngineers.0.vulcanizationSteps.${
          repeatStepList[0]
        }.coatingLayers.${repeatStepList[1] - 1}.cumulativeThickness.${
          repeatStepList[2]
        }.data.cumulativeThickness`
      )
    );
  } else {
    previousCumulativeThickness = Number(
      findValue(
        values,
        `leadEngineers.0.measurementPointActualTdvs.${repeatStepList[2]}.data.measurementPointActual`
      )
    );
  }

  let proposedThickness = Number(
    findValue(
      values,
      `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.proposedThickness`
    )
  );
  let layersUnique = findValue(
    values,
    `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.layersUnique`
  );

  let tvd = findValue(values, `leadEngineers.0.data.targetDescriptionValue`);

  let cumulativeThickness = 0;
  if (layersUnique) {
    proposedThickness = 0;
  }

  if (tvd === "OD") {
    cumulativeThickness =
      previousCumulativeThickness + (previousLayers + proposedThickness) * 2;
  } else if (tvd === "ID") {
    cumulativeThickness =
      previousCumulativeThickness - (previousLayers + proposedThickness) * 2;
  } else {
    cumulativeThickness =
      previousCumulativeThickness + previousLayers + proposedThickness;
  }
  return whatTooReturn(cumulativeThickness, decimal, [
    previousCumulativeThickness,
    proposedThickness,
    layersUnique
  ]);
};

const mathProposedThickness = (values, repeatStepList, decimal) => {
  let partOfNumber = 0;
  let shrink = Number(
    findValue(
      values,
      `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.shrink`
    )
  );
  let actualThickness = Number(
    findValue(
      values,
      `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.actualThickness`
    )
  );

  if (shrink) {
    partOfNumber = (shrink * actualThickness) / 100;
  }

  return whatTooReturn(actualThickness + partOfNumber, decimal, [
    shrink,
    actualThickness
  ]);
};

const mathToleranceMin = (values, repeatStepList, decimal) => {
  let toleranceMaxPercent = Number(
    findValue(values, "leadEngineers.0.data.toleranceMaxPercent")
  );

  let orderedTotalRubberThickness = Number(
    findValue(values, "leadEngineers.0.data.orderedTotalRubberThickness")
  );
  return whatTooReturn(
    (orderedTotalRubberThickness * toleranceMaxPercent) / 100,
    decimal,
    [toleranceMaxPercent, orderedTotalRubberThickness]
  );
};

const mathToleranceMax = (values, repeatStepList, decimal) => {
  let toleranceMaxPercent = Number(
    findValue(values, "leadEngineers.0.data.toleranceMaxPercent")
  );
  let orderedTotalRubberThickness = Number(
    findValue(values, "leadEngineers.0.data.orderedTotalRubberThickness")
  );
  return whatTooReturn(
    (orderedTotalRubberThickness * toleranceMaxPercent) / 100,
    decimal,
    [toleranceMaxPercent, orderedTotalRubberThickness]
  );
};


const Math = {
  mathCumulativeThickness,
  mathProposedThickness,
  mathToleranceMin,
  mathToleranceMax,
  qualityControlMeasurementPointCoatingItemMin,
  qualityControlMeasurementPointCoatingItemMax,
  qualityControlMeasurementPointMouldMin,
  qualityControlMeasurementPointMouldMax
};

export default Math;
