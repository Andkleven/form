import { allZeroOrNaN, findValue } from "./Functions";

const whatTooReturn = (value, decimal, array = [true]) => {
  if (array.every(allZeroOrNaN)) {
    return null;
  } else {
    return value.toFixed(decimal);
  }
};

const qualityControlMeasurementPointMould = (allData, tolerance, decimal) => {
  let orderedTotalRubberThicknes = findValue(
    allData,
    `items.0.leadEngineers.0.data.orderedTotalRubberThicknes`
  );
  let value = orderedTotalRubberThicknes + tolerance;

  return whatTooReturn(value, decimal, [orderedTotalRubberThicknes, tolerance]);
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
      `items.0.leadEngineers.0.measurementPointActualTvds.${
        repeatStepList[0]
      }.data.measurementPointActual`
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

const mathCumulativeThicknes = (values, repeatStepList, decimal) => {
  let previousCumulativeThicknes = 0;
  let previousLayers = 0;
  if (repeatStepList[0] && repeatStepList[1] === 0) {
    const sumProposedThicknes = data => {
      previousLayers += Number(data.data.actualThicknes);
    };
    for (let i = 0; i < repeatStepList[0]; i++) {
      let coatingLayers = findValue(
        values,
        `leadEngineers.0.vulcanizationSteps.${i}.coatingLayers`
      );
      coatingLayers.forEach(data => sumProposedThicknes(data));
    }
  }
  if (repeatStepList[1]) {
    previousCumulativeThicknes = Number(
      findValue(
        values,
        `leadEngineers.0.vulcanizationSteps.${
          repeatStepList[0]
        }.coatingLayers.${repeatStepList[1] - 1}.cumulativeThicknes.${
          repeatStepList[2]
        }.data.cumulativeThicknes`
      )
    );
  } else {
    previousCumulativeThicknes = Number(
      findValue(
        values,
        `leadEngineers.0.measurementPointActualTvds.${
          repeatStepList[2]
        }.data.measurementPointActual`
      )
    );
  }

  let proposedThicknes = Number(
    findValue(
      values,
      `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${
        repeatStepList[1]
      }.data.proposedThicknes`
    )
  );
  let layersUnique = findValue(
    values,
    `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${
      repeatStepList[1]
    }.data.layersUnique`
  );

  let tvd = findValue(values, `leadEngineers.0.data.targetDescriptionValue`);

  let cumulativeThicknes = 0;
  if (layersUnique) {
    proposedThicknes = 0;
  }

  if (tvd === "OD") {
    cumulativeThicknes =
      previousCumulativeThicknes + (previousLayers + proposedThicknes) * 2;
  } else if (tvd === "ID") {
    cumulativeThicknes =
      previousCumulativeThicknes - (previousLayers + proposedThicknes) * 2;
  } else {
    cumulativeThicknes =
      previousCumulativeThicknes + previousLayers + proposedThicknes;
  }
  return whatTooReturn(cumulativeThicknes, decimal, [
    previousCumulativeThicknes,
    proposedThicknes,
    layersUnique
  ]);
};

const mathProposedThicknes = (values, repeatStepList, decimal) => {
  let partOfNumber = 0;
  let shrink = Number(
    findValue(
      values,
      `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${
        repeatStepList[1]
      }.data.shrink`
    )
  );
  let actualThicknes = Number(
    findValue(
      values,
      `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${
        repeatStepList[1]
      }.data.actualThicknes`
    )
  );

  if (shrink) {
    partOfNumber = (shrink * actualThicknes) / 100;
  }

  return whatTooReturn(actualThicknes + partOfNumber, decimal, [
    shrink,
    actualThicknes
  ]);
};

const mathToleranceMinPercent = (values, repeatStepList, decimal) => {
  let toleranceMin = Number(
    findValue(values, "leadEngineers.0.data.toleranceMin")
  );

  let orderedTotalRubberThicknes = Number(
    findValue(values, "leadEngineers.0.data.orderedTotalRubberThicknes")
  );
  return whatTooReturn(
    (toleranceMin * 100) / orderedTotalRubberThicknes,
    decimal,
    [toleranceMin, orderedTotalRubberThicknes]
  );
};

const mathToleranceMaxPercent = (values, repeatStepList, decimal) => {
  let toleranceMax = Number(
    findValue(values, "leadEngineers.0.data.toleranceMax")
  );
  let orderedTotalRubberThicknes = Number(
    findValue(values, "leadEngineers.0.data.orderedTotalRubberThicknes")
  );
  return whatTooReturn(
    (toleranceMax * 100) / orderedTotalRubberThicknes,
    decimal,
    [toleranceMax, orderedTotalRubberThicknes]
  );
};

const Math = {
  mathCumulativeThicknes,
  mathProposedThicknes,
  mathToleranceMinPercent,
  mathToleranceMaxPercent,
  qualityControlMeasurementPointCoatingItemMin,
  qualityControlMeasurementPointCoatingItemMax,
  qualityControlMeasurementPointMouldMin,
  qualityControlMeasurementPointMouldMax
};

export default Math;
