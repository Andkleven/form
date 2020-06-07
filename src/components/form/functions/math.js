import { allZeroOrNaN, findValue } from "../../../functions/general";
import objectPath from "object-path";

const whatTooReturn = (value, decimal, array = [true]) => {
  if (array.every(allZeroOrNaN)) {
    return null;
  } else {
    if (decimal) {
      return value.toFixed(decimal);
    }
    return value.toFixed(1)
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
      previousLayers += Number(data.data.shrinkThickness);
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

  let appliedThickness = Number(
    findValue(
      values,
      `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.appliedThickness`
    )
  );
  let layersUnique = findValue(
    values,
    `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.layersUnique`
  );

  let tvd = findValue(values, `leadEngineers.0.data.targetDescriptionValue`);

  let cumulativeThickness = 0;
  if (layersUnique) {
    appliedThickness = 0;
  }

  if (tvd === "OD") {
    cumulativeThickness =
      previousCumulativeThickness + (previousLayers + appliedThickness) * 2;
  } else if (tvd === "ID") {
    cumulativeThickness =
      previousCumulativeThickness - (previousLayers + appliedThickness) * 2;
  } else {
    cumulativeThickness =
      previousCumulativeThickness + previousLayers + appliedThickness;
  }
  return whatTooReturn(cumulativeThickness, decimal, [
    previousCumulativeThickness,
    appliedThickness,
    layersUnique
  ]);
};

const mathShrinkThickness = (values, repeatStepList, decimal) => {
  let partOfNumber = 0;
  let shrink = Number(
    findValue(
      values,
      `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.shrink`
    )
  );
  let shrinkThickness = Number(
    findValue(
      values,
      `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.appliedThickness`
    )
  );

  if (shrink) {
    partOfNumber = (shrink * shrinkThickness) / 100;
  }

  return whatTooReturn(shrinkThickness - partOfNumber, decimal, [
    shrink,
    shrinkThickness
  ]);
};

const mathToleranceMin = (values, repeatStepList, decimal) => {
  let toleranceMinPercent = Number(
    findValue(values, "leadEngineers.0.data.toleranceMinPercent")
  );

  let orderedTotalRubberThickness = Number(
    findValue(values, "leadEngineers.0.data.orderedTotalRubberThickness")
  );
  return whatTooReturn(
    orderedTotalRubberThickness - (orderedTotalRubberThickness * toleranceMinPercent) / 100,
    decimal,
    [toleranceMinPercent, orderedTotalRubberThickness]
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
    orderedTotalRubberThickness + (orderedTotalRubberThickness * toleranceMaxPercent) / 100,
    decimal,
    [toleranceMaxPercent, orderedTotalRubberThickness]
  );
};

const layer = (values, repeatStepList, decimal) => {
  let layers = 0
  for (let index = 0; index < repeatStepList[0]; index++) {
    layers = objectPath.get(values, `leadEngineers.0.vulcanizationSteps.${index}.coatingLayers`).length
  }
  layers += repeatStepList[1] + 1
  return layers
}


const Math = {
  mathCumulativeThickness,
  mathShrinkThickness,
  mathToleranceMin,
  mathToleranceMax,
  qualityControlMeasurementPointCoatingItemMin,
  qualityControlMeasurementPointCoatingItemMax,
  qualityControlMeasurementPointMouldMin,
  qualityControlMeasurementPointMouldMax,
  layer
};

export default Math;
