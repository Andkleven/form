import {
  allZeroOrNaN,
  findValue,
  lowerCaseFirstLetter,
  removeSpace
} from "../../../functions/general";
import objectPath from "object-path";

const whatTooReturn = (value, decimal, array = [true]) => {
  if (array.every(allZeroOrNaN)) {
    return null;
  } else {
    if (![null, undefined].includes(decimal)) {
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

const mathCumulativeThickness = (
  values,
  repeatStepList,
  decimal,
  mathStore
) => {
  let previousCumulativeThickness = 0;
  let previousLayers = 0;
  if (repeatStepList[0] && repeatStepList[1] === 0) {
    let coatingLength =
      objectPath.get(
        mathStore,
        `leadEngineers.0.vulcanizationSteps.${
          repeatStepList[0] - 1
        }.coatingLayers`
      ).length - 1;
    previousCumulativeThickness = Number(
      objectPath.get(
        mathStore,
        `leadEngineers.0.vulcanizationSteps.${
          repeatStepList[0] - 1
        }.coatingLayers.${coatingLength}.cumulativeThickness.${
          repeatStepList[2]
        }.data.cumulativeThickness`,
        0
      )
    );
  } else if (repeatStepList[1]) {
    previousCumulativeThickness = Number(
      objectPath.get(
        mathStore,
        `leadEngineers.0.vulcanizationSteps.${
          repeatStepList[0]
        }.coatingLayers.${repeatStepList[1] - 1}.cumulativeThickness.${
          repeatStepList[2]
        }.data.cumulativeThickness`,
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

const mathShrinkThickness = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
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

const mathToleranceMin = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
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

const mathToleranceMax = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
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

const mathLayer = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
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

const mathPeelTest = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  let peelTest = Number(
    findValue(
      values,
      `finalInspectionQualityControls.0.peelTestQualityControls.${repeatStepList[0]}.data.peelTest`
    )
  );

  return peelTest ? (peelTest * 9.81).toFixed(2) : null;
};

const mathMeasurementPoints = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  let elementLength = Number(
    findValue(values, `leadEngineers.0.data.elementLength`)
  );
  return whatTooReturn(elementLength / 1000, decimal, [elementLength]);
};

const packerType = {
  compoundNoRubberType: {
    "35-5265": {
      geometry: "OS",
      programNumber: "14",
      coreSampleCode: "M",
      packingSpecification: "PP2"
    },
    "35-5265/5266": {
      geometry: "OS L",
      programNumber: "14",
      coreSampleCode: "N",
      packingSpecification: "PP2"
    },
    "35-5266": {
      geometry: "OS LSR",
      programNumber: "14",
      coreSampleCode: "O",
      packingSpecification: "PP2"
    },
    "35-4063": {
      geometry: "WS NT",
      programNumber: "16",
      coreSampleCode: "A",
      packingSpecification: "PP4"
    },
    "35-4064": {
      geometry: "WS LT",
      programNumber: "14",
      coreSampleCode: "B",
      packingSpecification: "PP3"
    },
    "35-4050": {
      geometry: "WS HT",
      programNumber: "12",
      coreSampleCode: "D",
      packingSpecification: "PP4"
    },
    "12-3278": {
      geometry: "WS ES",
      programNumber: "Steam autoclave 12 or 20 Hot air",
      coreSampleCode: "",
      packingSpecification: "PP4"
    }
  },
  compoundNoOd: {
    "35-5265": {
      geometry: "OS",
      compoundNoId: "35-5265",
      programNumber: "15",
      coreSampleCode: "M",
      packingSpecification: "PP2"
    },
    "35-5265/5266": {
      geometry: "OS L",
      compoundNoId: "35-5265",
      programNumber: "15",
      coreSampleCode: "N",
      packingSpecification: "PP2"
    },
    "35-5266": {
      geometry: "OS LSR",
      compoundNoId: "35-5265",
      programNumber: "15",
      coreSampleCode: "O",
      packingSpecification: "PP2"
    },
    "35-4063": {
      geometry: "WS NT",
      compoundNoId: "35-4063",
      programNumber: "11",
      coreSampleCode: "A",
      packingSpecification: "PP4"
    },
    "35-4064": {
      geometry: "WS LT",
      compoundNoId: "35-4064",
      programNumber: "15",
      coreSampleCode: "B",
      packingSpecification: "PP3"
    },
    "35-4050": {
      geometry: "WS HT",
      compoundNoId: "35-4050",
      programNumber: "12",
      coreSampleCode: "D",
      packingSpecification: "PP4"
    },
    "12-3278": {
      geometry: "WS ES",
      compoundNoId: "12-3278",
      programNumber: "17",
      coreSampleCode: "",
      packingSpecification: "PP4"
    }
  },
  compoundNo2: {
    "35-5265": {
      geometry: "WS NT/OS",
      compoundNo1: "35-4063",
      programNumber: "14",
      coreSampleCode: "A/M",
      packingSpecification: "PP4"
    },
    "35-4064": {
      geometry: "OS/WS LT",
      compoundNo1: "35-5265",
      programNumber: "14",
      coreSampleCode: "M/B",
      packingSpecification: "PP3"
    },
    "35-5265/5266": {
      geometry: "WS NT/OS L",
      compoundNo1: "35-4063",
      programNumber: "14",
      coreSampleCode: "A/N",
      packingSpecification: "PP4"
    },
    "35-4046": {
      geometry: "OS L/ WS LT",
      compoundNo1: "35-5265/5266",
      programNumber: "14",
      coreSampleCode: "N/B",
      packingSpecification: "PP3"
    }
  }
};

const geometryToType = {
  b2P: "compoundNoRubberType",
  slipon: "compoundNoOd",
  dual: "compoundNo2"
};

function getType(values, jsonVariables, fieldToGet) {
  let geometry = removeSpace(lowerCaseFirstLetter(jsonVariables[0]));
  let field = geometryToType[geometry];
  let value = objectPath.get(values, `leadEngineers.0.data.${field}`);
  return value && packerType[field][value]
    ? packerType[field][value][fieldToGet]
    : "";
}

const mathCoreSampleCode = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  return getType(values, jsonVariables, "coreSampleCode");
};

const mathPackingSpecification = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  return getType(values, jsonVariables, "packingSpecification");
};

const mathProgramNumber = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  return getType(values, jsonVariables, "programNumber");
};

const mathCompoundNoId = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  return getType(values, jsonVariables, "compoundNoId");
};

const mathCompoundNo1 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  return getType(values, jsonVariables, "compoundNo1");
};

function addHyphen(string, showHyphen) {
  return showHyphen ? string + "-" : string;
}

const mathDescription = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  let rubberType = getType(values, jsonVariables, "geometry");
  let elementLength = objectPath.get(
    values,
    `leadEngineers.0.data.elementLength`,
    ""
  );
  let rubberOd = objectPath.get(values, `leadEngineers.0.data.rubberOd`, "");
  let pipeOd = objectPath.get(values, `leadEngineers.0.data.pipeOd`, "");
  let barrier1 = objectPath.get(values, `leadEngineers.0.data.barrier1`, "");
  let barrier2 = objectPath.get(values, `leadEngineers.0.data.barrier2`, "");

  return (
    addHyphen(rubberType, elementLength) +
    addHyphen(elementLength, rubberOd) +
    addHyphen(rubberOd, pipeOd) +
    addHyphen(pipeOd, barrier1) +
    addHyphen(barrier1, barrier2) +
    barrier2
  );
};

const mathScrewDescription = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  let screwMaterialType = objectPath.get(
    values,
    `leadEngineers.0.data.screwMaterialType`,
    ""
  );
  let screwSize = objectPath.get(values, `leadEngineers.0.data.screwSize`, "");
  let screwLength = objectPath.get(
    values,
    `leadEngineers.0.data.screwLength`,
    ""
  );
  return (
    screwMaterialType &&
    screwSize &&
    screwLength &&
    screwMaterialType + " " + screwSize + "x" + screwLength + "mm"
  );
};

const Math = {
  mathScrewDescription,
  mathDescription,
  mathCompoundNo1,
  mathCompoundNoId,
  mathProgramNumber,
  mathPackingSpecification,
  mathCoreSampleCode,
  mathMeasurementPoints,
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
