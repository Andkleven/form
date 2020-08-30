import { allZeroOrNaN, findValue } from "../../../functions/general";
import objectPath from "object-path";

const whatTooReturn = (value, decimal, array = [true]) => {
  if (array.every(allZeroOrNaN)) {
    return null;
  } else {
    if (decimal) {
      return value.toFixed(decimal);
    }
    return value.toFixed(1);
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

const qualityControlMeasurementPointMouldMin = (
  allData,
  data,
  repeatStepList
) => {
  let toleranceMin = Number(
    mathToleranceMin(allData["items"][0], repeatStepList, 0)
  );
  return qualityControlMeasurementPointMould(allData, toleranceMin, 1);
};
const qualityControlMeasurementPointMouldMax = (
  allData,
  data,
  repeatStepList
) => {
  let toleranceMax = Number(
    mathToleranceMax(allData["items"][0], repeatStepList, 0)
  );
  return qualityControlMeasurementPointMould(allData, toleranceMax, 1);
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
  data,
  repeatStepList
) => {
  let toleranceMin = Number(
    mathToleranceMin(allData["items"][0], repeatStepList, 0)
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
  data,
  repeatStepList
) => {
  let toleranceMax = Number(
    mathToleranceMax(allData["items"][0], repeatStepList, 0)
  );
  return qualityControlMeasurementPointCoatingItem(
    allData,
    repeatStepList,
    toleranceMax,
    1
  );
};


const mathCumulativeThickness = (values, repeatStepList, decimal, mathStore) => {
  let previousCumulativeThickness = 0;
  let previousLayers = 0;
  if (repeatStepList[0] && repeatStepList[1] === 0) {
    let coatingLength = objectPath.get(mathStore, `leadEngineers.0.vulcanizationSteps.${repeatStepList[0] - 1}.coatingLayers`).length - 1
    previousCumulativeThickness = Number(
      objectPath.get(
        mathStore,
        `leadEngineers.0.vulcanizationSteps.${repeatStepList[0] - 1}.coatingLayers.${coatingLength}.cumulativeThickness.${repeatStepList[2]}.data.cumulativeThickness`,
        0
      )
    );
  } else if (repeatStepList[1]) {
    previousCumulativeThickness = Number(
      objectPath.get(
        mathStore,
        `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1] - 1}.cumulativeThickness.${repeatStepList[2]}.data.cumulativeThickness`,
        0
      )
    );
  } else {
    previousCumulativeThickness = Number(
      objectPath.get(
        values,
        `leadEngineers.0.measurementPointActualTdvs.${repeatStepList[2]}.data.measurementPointActual`,
        0
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

const mathCumulativeThicknessAll = (values, repeatStepList, decimal) => {
  let previousCumulativeThickness = 0;
  let previousLayers = 0;
  if (repeatStepList[0] && repeatStepList[1] === 0) {
    const sumProposedThickness = stepList => {
      previousLayers += Number(mathShrinkThickness(values, stepList, 0));
    };
    for (let i = 0; i < repeatStepList[0]; i++) {
      let coatingLayers = findValue(
        values,
        `leadEngineers.0.vulcanizationSteps.${i}.coatingLayers`
      );
      coatingLayers.forEach((data, index) => sumProposedThickness([i, index]));
    }
  }
  if (repeatStepList[1]) {
    for (let i = 0; i < repeatStepList[1]; i++) {
      previousCumulativeThickness = Number(
        mathCumulativeThicknessAll(values, [
          repeatStepList[0],
          i,
          repeatStepList[2]
        ])
      );
    }
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

const mathShrinkThickness = (values, repeatStepList, decimal, mathStore = null) => {
  let partOfNumber = 0;
  let shrink = Number(
    findValue(
      values,
      `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.shrink`
    )
  );
  let shrunkThickness = Number(
    findValue(
      values,
      `leadEngineers.0.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.appliedThickness`
    )
  );
  if (shrink) {
    partOfNumber = (shrink * shrunkThickness) / 100;
  }
  return whatTooReturn(shrunkThickness - partOfNumber, decimal, [
    shrink,
    shrunkThickness
  ]);
};

const mathToleranceMin = (values, repeatStepList, decimal, mathStore = null) => {
  let toleranceMinPercent = Number(
    findValue(values, "leadEngineers.0.data.toleranceMinPercent")
  );

  let orderedTotalRubberThickness = Number(
    findValue(values, "leadEngineers.0.data.orderedTotalRubberThickness")
  );
  return whatTooReturn(
    orderedTotalRubberThickness -
    (orderedTotalRubberThickness * toleranceMinPercent) / 100,
    decimal,
    [toleranceMinPercent, orderedTotalRubberThickness]
  );
};

const mathToleranceMax = (values, repeatStepList, decimal, mathStore = null) => {
  let toleranceMaxPercent = Number(
    findValue(values, "leadEngineers.0.data.toleranceMaxPercent")
  );
  let orderedTotalRubberThickness = Number(
    findValue(values, "leadEngineers.0.data.orderedTotalRubberThickness")
  );
  return whatTooReturn(
    orderedTotalRubberThickness +
    (orderedTotalRubberThickness * toleranceMaxPercent) / 100,
    decimal,
    [toleranceMaxPercent, orderedTotalRubberThickness]
  );
};

const mathLayer = (values, repeatStepList, decimal, mathStore = null) => {
  let layers = 0;
  for (let index = 0; index < repeatStepList[0]; index++) {
    layers += objectPath.get(
      values,
      `leadEngineers.0.vulcanizationSteps.${index}.coatingLayers`
    ).length;
  }
  layers += repeatStepList[1] + 1;
  return layers;
};

const mathMeasurementPoint = (data, repeatStepList) => {
  let layerThickness = 0;
  const coatingLayers = index => {
    objectPath
      .get(data, `leadEngineers.0.vulcanizationSteps.${index}.coatingLayers`)
      .forEach((coatingLayer, index2) => {
        layerThickness += Number(mathShrinkThickness(data, [index, index2], 0));
      });
  };
  for (let index = 0; index <= repeatStepList[0]; index++) {
    coatingLayers(index);
  }
  return layerThickness;
};

const mathMeasurementPointMin = (allData, data, repeatStepList) => {
  let layerThickness = mathMeasurementPoint(data, repeatStepList);
  let toleranceMinPercent = Number(
    objectPath.get(data, `leadEngineers.0.data.toleranceMinPercent`)
  );
  return layerThickness - (layerThickness * toleranceMinPercent) / 100;
};

const mathMeasurementPointMax = (allData, data, repeatStepList) => {
  let layerThickness = mathMeasurementPoint(data, repeatStepList);
  let toleranceMaxPercent = Number(
    objectPath.get(data, `leadEngineers.0.data.toleranceMaxPercent`)
  );
  return layerThickness + (layerThickness * toleranceMaxPercent) / 100;
};

const mathPeelTest = (values, repeatStepList, decimal, mathStore = null) => {
  let peelTest = Number(
    findValue(
      values,
      `finalInspectionQualityControls.0.peelTestQualityControls.${repeatStepList[0]}.data.peelTest`
    )
  );

  return peelTest ? (peelTest * 9.81).toFixed(2) : null;
};

const Math = {
  mathCumulativeThicknessAll,
  mathCumulativeThickness,
  mathShrinkThickness,
  mathToleranceMin,
  mathToleranceMax,
  qualityControlMeasurementPointCoatingItemMin,
  qualityControlMeasurementPointCoatingItemMax,
  qualityControlMeasurementPointMouldMin,
  qualityControlMeasurementPointMouldMax,
  mathLayer,
  mathMeasurementPointMin,
  mathMeasurementPointMax,
  mathPeelTest
};

export default Math;
