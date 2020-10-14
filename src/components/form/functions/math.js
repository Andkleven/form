import {
  allZeroOrNaN,
  findValue,
  lowerCaseFirstLetter,
  removeSpace
} from "../../../functions/general";
import objectPath from "object-path";

const whatTooReturn = (value, decimal, array = [true]) => {
  if (!(typeof value === "number")) {
    return 0
  }
  if (array.every(allZeroOrNaN)) {
    return 0;
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
    `items.0.leadEngineer.data.orderedTotalRubberThickness`
  );
  let value = orderedTotalRubberThickness + tolerance;

  return whatTooReturn(value, decimal, [
    orderedTotalRubberThickness,
    tolerance
  ]);
};

const mathToleranceMin = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  let value = 0;
  let toleranceMin = Number(mathMin(values, repeatStepList, decimal));
  let measurementPointActual = objectPath.get(
    values,
    `leadEngineer.measurementPointActualTdvs.0.data.measurementPointActual`,
    0
  );
  let targetDescriptionValue = objectPath.get(
    values,
    `leadEngineer.targetDescriptionValue`
  );
  if (targetDescriptionValue === "ID") {
    value = measurementPointActual - toleranceMin;
  } else {
    value = measurementPointActual + toleranceMin;
  }
  return whatTooReturn(Number(value), decimal, [
    toleranceMin,
    measurementPointActual
  ]);
};
const mathToleranceMax = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  let value;
  let toleranceMax = Number(mathMax(values, repeatStepList, decimal));
  let measurementPointActual = objectPath.get(
    values,
    `leadEngineer.measurementPointActualTdvs.0.data.measurementPointActual`,
    0
  );
  let targetDescriptionValue = objectPath.get(
    values,
    `leadEngineer.targetDescriptionValue`
  );
  if (targetDescriptionValue === "ID") {
    value = measurementPointActual - toleranceMax;
  } else {
    value = measurementPointActual + toleranceMax;
  }
  return whatTooReturn(Number(value), decimal, [
    toleranceMax,
    measurementPointActual
  ]);
};

const mathQualityControlMeasurementPointMouldMin = (
  allData,
  data,
  repeatStepList
) => {
  let toleranceMin = Number(mathMin(allData["items"][0], repeatStepList, 0));
  return qualityControlMeasurementPointMould(allData, toleranceMin, 1);
};
const mathQualityControlMeasurementPointMouldMax = (
  allData,
  data,
  repeatStepList
) => {
  let toleranceMax = Number(mathMax(allData["items"][0], repeatStepList, 0));
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
      `items.0.leadEngineer.measurementPointActualTdvs.${repeatStepList[0]}.data.measurementPointActual`
    )
  );

  let targetDescriptionValue = findValue(
    allData,
    `items.0.leadEngineer.data.targetDescriptionValue`
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

const mathQualityControlMeasurementPointCoatingItemMin = (
  allData,
  data,
  repeatStepList
) => {
  let min = mathToleranceMin(allData["items"][0], repeatStepList, 0)
  return qualityControlMeasurementPointCoatingItem(allData, repeatStepList, min, 0)
};
const mathQualityControlMeasurementPointCoatingItemMax = (
  allData,
  data,
  repeatStepList
) => {
  let max = mathToleranceMax(allData["items"][0], repeatStepList, 0)
  return qualityControlMeasurementPointCoatingItem(allData, repeatStepList, max, 0)
};

const mathThicknessAll = (values, repeatStepList, decimal) => {
  let previousThickness = 0;
  let previousLayers = 0;
  if (repeatStepList[0] && repeatStepList[1] === 0) {
    const sumProposedThickness = stepList => {
      previousLayers += Number(mathShrinkThickness(values, stepList, 0));
    };
    for (let i = 0; i < repeatStepList[0]; i++) {
      let coatingLayers = findValue(
        values,
        `leadEngineer.vulcanizationSteps.${i}.coatingLayers`
      );
      coatingLayers.forEach((data, index) => sumProposedThickness([i, index]));
    }
  }
  if (repeatStepList[1]) {
    for (let i = 0; i < repeatStepList[1]; i++) {
      previousThickness = Number(
        mathThicknessAll(values, [repeatStepList[0], i, repeatStepList[2]])
      );
    }
  }

  let appliedThickness = Number(
    findValue(
      values,
      `leadEngineer.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.appliedThickness`
    )
  );
  let layersUnique = findValue(
    values,
    `leadEngineer.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.layersUnique`
  );

  let tvd = findValue(values, `leadEngineer.data.targetDescriptionValue`);

  let thickness = 0;
  if (layersUnique) {
    appliedThickness = 0;
  }
  if (tvd === "OD") {
    thickness = previousThickness + (previousLayers + appliedThickness) * 2;
  } else if (tvd === "ID") {
    thickness = previousThickness - (previousLayers + appliedThickness) * 2;
  } else {
    thickness = previousThickness + previousLayers + appliedThickness;
  }
  return thickness ? thickness : 0;
};

const mathLayerMin = (values, data, repeatStepList) => {
  let thicknessAll = mathThicknessAll(data, repeatStepList, 1);
  let measurementPointActual = Number(
    findValue(
      data,
      `leadEngineer.measurementPointActualTdvs.${repeatStepList[2]}.data.measurementPointActual`
    )
  );
  let min = Number(findValue(data, `leadEngineer.data.toleranceMinPercent`));
  return whatTooReturn(
    measurementPointActual + thicknessAll - (thicknessAll * min) / 100,
    1,
    [measurementPointActual, thicknessAll, min]
  );
};

const mathLayerMax = (values, data, repeatStepList) => {
  let thicknessAll = mathThicknessAll(data, repeatStepList, 1);
  let measurementPointActual = Number(
    findValue(
      data,
      `leadEngineer.measurementPointActualTdvs.${repeatStepList[2]}.data.measurementPointActual`
    )
  );
  let max = Number(findValue(data, `leadEngineer.data.toleranceMaxPercent`));
  return whatTooReturn(
    measurementPointActual + thicknessAll + (thicknessAll * max) / 100,
    1,
    [measurementPointActual, thicknessAll, max]
  );
};

const mathLayerMinMax = (values, repeatStepList, decimal) => {
  let thicknessAll = mathThicknessAll(values, repeatStepList, 1);
  let min = Number(findValue(values, `leadEngineer.data.toleranceMinPercent`));
  let max = Number(findValue(values, `leadEngineer.data.toleranceMaxPercent`));
  min = thicknessAll - (thicknessAll * min) / 100;
  max = thicknessAll + (thicknessAll * max) / 100;

  return `${min.toFixed(1)}mm - ${max.toFixed(1)}mm`;
};

const mathShrinkThickness = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  let partOfNumber = 0;
  let shrink = Number(
    findValue(
      values,
      `leadEngineer.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.shrink`
    )
  );
  let shrunkThickness = Number(
    findValue(
      values,
      `leadEngineer.vulcanizationSteps.${repeatStepList[0]}.coatingLayers.${repeatStepList[1]}.data.appliedThickness`
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

const mathMin = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  let targetDescriptionValue = objectPath.get(
    values,
    `leadEngineer.targetDescriptionValue`,
    null
  );
  let toleranceMinPercent = Number(
    findValue(values, "leadEngineer.data.toleranceMinPercent")
  );
  let orderedTotalRubberThickness = Number(
    findValue(values, "leadEngineer.data.orderedTotalRubberThickness")
  );
  let min = orderedTotalRubberThickness -
      (orderedTotalRubberThickness * toleranceMinPercent) / 100
  if (targetDescriptionValue) {
    min = min*2
  }
  return whatTooReturn(
    min,
    decimal,
    [toleranceMinPercent, orderedTotalRubberThickness]
  );
};

const mathMax = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  let targetDescriptionValue = objectPath.get(
    values,
    `leadEngineer.targetDescriptionValue`,
    null
  );
  let toleranceMaxPercent = Number(
    findValue(values, "leadEngineer.data.toleranceMaxPercent")
  );
  let orderedTotalRubberThickness = Number(
    findValue(values, "leadEngineer.data.orderedTotalRubberThickness")
  );
  let max = orderedTotalRubberThickness +
      (orderedTotalRubberThickness * toleranceMaxPercent) / 100
  if (targetDescriptionValue) {
    max = max*2
  }
  return whatTooReturn(
    max,
    decimal,
    [toleranceMaxPercent, orderedTotalRubberThickness]
  );
};

const mathLayer = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  let layers = 0;
  for (let index = 0; index < repeatStepList[0]; index++) {
    layers += objectPath.get(
      values,
      `leadEngineer.vulcanizationSteps.${index}.coatingLayers`
    ).length;
  }
  layers += repeatStepList[1] + 1;
  return layers;
};

const mathMeasurementPoint = (data, repeatStepList, documentData) => {
  let layerThickness = 0;
  const coatingLayers = index => {
    objectPath
      .get(data, `leadEngineer.vulcanizationSteps.${index}.coatingLayers`)
      .forEach((coatingLayer, index2) => {
        layerThickness += Number(mathShrinkThickness(data, [index, index2], 0));
      });
  };
  for (let index = 0; index <= repeatStepList[0]; index++) {
    coatingLayers(index);
  }
  return layerThickness;
};

const mathMeasurementPointMin = (
  allData,
  data,
  repeatStepList,
  documentData
) => {
  let layerThickness = mathMeasurementPoint(data, repeatStepList, documentData);
  let toleranceMinPercent = Number(
    objectPath.get(data, `leadEngineer.data.toleranceMinPercent`)
  );
  return layerThickness - (layerThickness * toleranceMinPercent) / 100;
};

const mathMeasurementPointMax = (
  allData,
  data,
  repeatStepList,
  documentData
) => {
  let layerThickness = mathMeasurementPoint(data, repeatStepList, documentData);
  let toleranceMaxPercent = Number(
    objectPath.get(data, `leadEngineer.data.toleranceMaxPercent`)
  );
  return layerThickness + (layerThickness * toleranceMaxPercent) / 100;
};

const mathMouldThickness = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  let lastVulcanizationOperator = false;
  let thickness = 0;
  let stop = false;
  for (const [indexVulcanizationOperators, vulcanizationStep] of objectPath
    .get(values, `operator.vulcanizationOperators`, [])
    .entries()) {
    if (indexVulcanizationOperators === repeatStepList[0]) {
      lastVulcanizationOperator = true;
    }
    let lastCoatingOperator = false;
    for (const [indexCoatingOperator, coatingOperator] of objectPath
      .get(vulcanizationStep, `coatingOperators`, [])
      .entries()) {
      if (indexCoatingOperator === repeatStepList[1]) {
        lastCoatingOperator = true;
      }
      for (const [indexLayer, layer] of objectPath
        .get(coatingOperator, `layers`, [])
        .entries()) {
        thickness += Number(layer.data.rubberThickness);
        if (
          indexLayer === repeatStepList[2] &&
          lastCoatingOperator &&
          lastVulcanizationOperator
        ) {
          stop = true;
          break;
        }
      }
      if (stop) break;
    }
    if (stop) break;
  }
  return thickness.toFixed(1);
};

const mathPeelTest = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  let peelTest = Number(
    findValue(
      values,
      `finalInspectionQualityControl.peelTestQualityControls.${repeatStepList[0]}.data.peelTest`
    )
  );

  return peelTest ? (peelTest * 9.81).toFixed(2) : null;
};

const floor = number => {
  let value;
  try {
    value = Number(String(number).split(".")[0]);
  } catch (error) {
    value = 0;
  }
  return value;
};

const mathMeasurementPoints = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  let elementLength = Number(
    findValue(values, `leadEngineer.data.elementLength`)
  );
  return elementLength && floor(elementLength / 1000);
};

const mathMeasurementPointsPinSide = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  let elementLength = Number(
    findValue(values, `leadEngineer.data.elementLengthPinSide`)
  );
  return elementLength && floor(elementLength / 1000);
};

const mathMeasurementPointsBoxSide = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  let elementLength = Number(
    findValue(values, `leadEngineer.data.elementLengthBoxSide`)
  );
  return elementLength && floor(elementLength / 1000);
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
      programNumber: { steamAutoclave: "12", hotAir: "20" },
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
  compoundNoPinSidecompoundNoBoxSide: {
    "35-406335-5265": {
      geometry: ["WS NT", "OS"],
      programNumber: "14",
      coreSampleCode: "A/M",
      packingSpecification: "PP4"
    },
    "35-526535-4064": {
      geometry: ["OS", "WS LT"],
      programNumber: "14",
      coreSampleCode: "M/B",
      packingSpecification: "PP3"
    },
    "35-406335-5265/5266": {
      geometry: ["WS NT", "OS L"],
      programNumber: "14",
      coreSampleCode: "A/N",
      packingSpecification: "PP4"
    },
    "35-5265/526635-4046": {
      geometry: ["OS L", " WS LT"],
      programNumber: "14",
      coreSampleCode: "N/B",
      packingSpecification: "PP3"
    }
  }
};

const geometryToType = {
  b2P: "compoundNoRubberType",
  slipon2: "compoundNoOd",
  slipon3: "compoundNoOd",
  dual: ["compoundNoPinSide", "compoundNoBoxSide"]
};

function getType(values, jsonVariables, fieldToGet) {
  let geometry = removeSpace(lowerCaseFirstLetter(jsonVariables[0]));
  let field = geometryToType[geometry];
  let value = "";
  if (Array.isArray(field)) {
    let name = "";
    field.forEach(filedName => {
      name = name + filedName;
      value = value + objectPath.get(values, `leadEngineer.data.${filedName}`);
    });
    field = name;
  } else {
    value = objectPath.get(values, `leadEngineer.data.${field}`);
  }
  let returnValue =
    value && packerType && packerType[field] && packerType[field][value]
      ? packerType[field][value][fieldToGet]
      : "";

  return returnValue;
}

const mathCoreSampleCode = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  let type = getType(values, jsonVariables, "coreSampleCode");
  return type ? type : "Combination does not exist";
};

const mathPackingSpecification = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  let type = getType(values, jsonVariables, "packingSpecification");
  return type ? type : "Combination does not exist";
};

const mathProgramNumber = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  let programNumber = getType(values, jsonVariables, "programNumber");
  if (
    programNumber &&
    typeof programNumber === "object" &&
    programNumber !== null &&
    !(programNumber instanceof Array)
  ) {
    let extraField = removeSpace(
      lowerCaseFirstLetter(
        objectPath.get(
          values,
          `leadEngineer.vulcanizationSteps.${repeatStepList[0]}.data.vulcanizationOption`,
          ""
        )
      )
    );
    programNumber = programNumber[extraField];
  }
  return programNumber;
};

const mathCompoundNoId = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return getType(values, jsonVariables, "compoundNoId");
};

const mathDescription = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  let geometry = removeSpace(lowerCaseFirstLetter(jsonVariables[0]));
  let rubberType = getType(values, jsonVariables, "geometry");
  let elementLength = floor(
    objectPath.get(values, `leadEngineer.data.elementLength`, "") / 1000
  );
  let elementLengthPinSide = floor(
    objectPath.get(values, `leadEngineer.data.elementLengthPinSide`, "") / 1000
  );
  let elementLengthBoxSide = floor(
    objectPath.get(values, `leadEngineer.data.elementLengthBoxSide`, "") / 1000
  );
  let pipeOd = objectPath.get(values, `leadEngineer.data.pipeOd`, "");
  let rubberOd = objectPath.get(values, `leadEngineer.data.rubberOd`, "");
  let barrier = objectPath.get(values, `leadEngineer.data.barrier`, "");
  let barrierPinSide = objectPath.get(
    values,
    `leadEngineer.data.barrierPinSide`,
    ""
  );
  let barrierBoxSide = objectPath.get(
    values,
    `leadEngineer.data.barrierBoxSide`,
    ""
  );
  let cable = objectPath.get(values, `leadEngineer.data.cable`, "");
  let K2 = objectPath.get(values, `leadEngineer.data.K2`, "");
  let numberOfTracks = objectPath.get(
    values,
    `leadEngineer.data.numberOfTracks`,
    ""
  );
  if (geometry === "dual") {
    return `SP ${K2 ? "K2" : ""} ${jsonVariables[0]} ${
      rubberType ? rubberType[0] : ""
    } ${barrierPinSide}x${elementLengthPinSide}M / ${
      rubberType ? rubberType[1] : ""
    } ${barrierBoxSide}x${elementLengthBoxSide}M ${pipeOd}x${rubberOd}`;
  } else {
    return `${geometry === "b2P" ? "SP" : jsonVariables[0]} ${K2 ? "K2" : ""} ${
      rubberType ? rubberType : ""
    } ${barrier} ${
      cable ? `CL${numberOfTracks}` : ""
    } ${pipeOd}x${rubberOd}x${elementLength}M`;
  }
};

const mathScrewDescription = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  let screwMaterialType = objectPath.get(
    values,
    `leadEngineer.data.screwMaterialType`,
    ""
  );
  let screwSize = objectPath.get(values, `leadEngineer.data.screwSize`, "");
  let screwLength = objectPath.get(values, `leadEngineer.data.screwLength`, "");
  return (
    screwMaterialType &&
    screwSize &&
    screwLength &&
    screwMaterialType + " " + screwSize + "x" + screwLength + "mm"
  );
};

const barrierCriteria = {
  "0A": {
    increasedOdForWholeElement: { total: 0, min: 0, max: 0 },
    increasedOdForEnds: { total: 0.9, min: 0.79, max: 1.01 }
  },
  "1A": {
    increasedOdForWholeElement: { total: 0.45, min: 0.34, max: 0.56 },
    increasedOdForEnds: { total: 1.35, min: 1.24, max: 1.46 }
  },
  "2A": {
    increasedOdForWholeElement: { total: 0.9, min: 0.79, max: 1.01 },
    increasedOdForEnds: { total: 1.8, min: 1.69, max: 1.91 }
  },
  "3A": {
    increasedOdForWholeElement: { total: 1.35, min: 1.24, max: 1.46 },
    increasedOdForEnds: { total: 2.25, min: 2.14, max: 2.36 }
  },
  "4A": {
    increasedOdForWholeElement: { total: 1.8, min: 1.69, max: 1.91 },
    increasedOdForEnds: { total: 2.7, min: 2.59, max: 2.81 }
  },
  "5A": {
    increasedOdForWholeElement: { total: 2.25, min: 2.14, max: 2.36 },
    increasedOdForEnds: { total: 3.15, min: 3.04, max: 3.26 }
  },
  "6A": {
    increasedOdForWholeElement: { total: 2.7, min: 2.59, max: 2.81 },
    increasedOdForEnds: { total: 3.6, min: 3.49, max: 3.71 }
  },
  "7A": {
    increasedOdForWholeElement: { total: 3.15, min: 3.04, max: 3.26 },
    increasedOdForEnds: { total: 4.05, min: 3.94, max: 4.16 }
  },
  "8A": {
    increasedOdForWholeElement: { total: 3.6, min: 3.49, max: 3.71 },
    increasedOdForEnds: { total: 4.5, min: 4.39, max: 4.61 }
  },
  "0B": {
    increasedOdForWholeElement: { total: 0, min: 0, max: 0 },
    increasedOdForEnds: { total: 0.1, min: 0.08, max: 0.13 }
  },
  "1B": {
    increasedOdForWholeElement: { total: 0.05, min: 0.03, max: 0.08 },
    increasedOdForEnds: { total: 0.15, min: 0.13, max: 0.18 }
  },
  "2B": {
    increasedOdForWholeElement: { total: 0.1, min: 0.08, max: 0.13 },
    increasedOdForEnds: { total: 0.2, min: 0.18, max: 0.23 }
  },
  "3B": {
    increasedOdForWholeElement: { total: 0.15, min: 0.13, max: 0.18 },
    increasedOdForEnds: { total: 0.25, min: 0.23, max: 0.28 }
  },
  "4B": {
    increasedOdForWholeElement: { total: 0.2, min: 0.18, max: 0.23 },
    increasedOdForEnds: { total: 0.3, min: 0.28, max: 0.33 }
  },
  "5B": {
    increasedOdForWholeElement: { total: 0.25, min: 0.23, max: 0.28 },
    increasedOdForEnds: { total: 0.35, min: 0.33, max: 0.38 }
  },
  "6B": {
    increasedOdForWholeElement: { total: 0.3, min: 0.28, max: 0.33 },
    increasedOdForEnds: { total: 0.4, min: 0.38, max: 0.43 }
  },
  "7B": {
    increasedOdForWholeElement: { total: 0.35, min: 0.33, max: 0.38 },
    increasedOdForEnds: { total: 0.45, min: 0.43, max: 0.48 }
  },
  "8B": {
    increasedOdForWholeElement: { total: 0.4, min: 0.38, max: 0.43 },
    increasedOdForEnds: { total: 0.5, min: 0.48, max: 0.53 }
  },
  "0C": {
    increasedOdForWholeElement: { total: 0, min: 0, max: 0 },
    increasedOdForEnds: { total: 0.2, min: 0.18, max: 0.23 }
  },
  "1C": {
    increasedOdForWholeElement: { total: 0.1, min: 0.08, max: 0.13 },
    increasedOdForEnds: { total: 0.25, min: 0.23, max: 0.28 }
  },
  "2C": {
    increasedOdForWholeElement: { total: 0.2, min: 0.18, max: 0.23 },
    increasedOdForEnds: { total: 0.2, min: 0.28, max: 0.33 }
  },
  "3C": {
    increasedOdForWholeElement: { total: 0.25, min: 0.23, max: 0.28 },
    increasedOdForEnds: { total: 0.36, min: 0.33, max: 0.38 }
  },
  "4C": {
    increasedOdForWholeElement: { total: 0.2, min: 0.28, max: 0.33 },
    increasedOdForEnds: { total: 0.41, min: 0.38, max: 0.43 }
  },
  "5C": {
    increasedOdForWholeElement: { total: 0.36, min: 0.33, max: 0.38 },
    increasedOdForEnds: { total: 0.46, min: 0.43, max: 0.48 }
  },
  "6C": {
    increasedOdForWholeElement: { total: 0.41, min: 0.38, max: 0.43 },
    increasedOdForEnds: { total: 0.51, min: 0.48, max: 0.53 }
  },
  "7C": {
    increasedOdForWholeElement: { total: 0.46, min: 0.43, max: 0.48 },
    increasedOdForEnds: { total: 0.56, min: 0.53, max: 0.58 }
  },
  "8C": {
    increasedOdForWholeElement: { total: 0.51, min: 0.48, max: 0.53 },
    increasedOdForEnds: { total: 0.61, min: 0.58, max: 0.63 }
  }
};

const mathIncreasedOdForWholeElementTotal = (values, field) => {
  let barrier = objectPath.get(values, `leadEngineer.data.${field}`, "");
  return barrier && barrierCriteria[barrier]
    ? barrierCriteria[barrier].increasedOdForWholeElement.total + "mm"
    : "";
};

const mathIncreasedOdForWholeElement = (values, field) => {
  let barrier = objectPath.get(values, `leadEngineer.data.${field}`, "");
  return barrier && barrierCriteria[barrier]
    ? barrierCriteria[barrier].increasedOdForWholeElement.min +
        "-" +
        barrierCriteria[barrier].increasedOdForWholeElement.max +
        "mm"
    : "";
};

const mathIncreasedOdForEndsTotal = (values, field) => {
  let barrier = objectPath.get(values, `leadEngineer.data.${field}`, "");
  return barrier && barrierCriteria[barrier]
    ? barrierCriteria[barrier].increasedOdForEnds.total + "mm"
    : "";
};

const increasedOdForEnds = (values, field) => {
  let barrier = objectPath.get(values, `leadEngineer.data.${field}`, "");
  return barrier && barrierCriteria[barrier]
    ? barrierCriteria[barrier].increasedOdForEnds.min +
        "-" +
        barrierCriteria[barrier].increasedOdForEnds.max +
        "mm"
    : "";
};
const mathIncreasedOdForWholeElementTotal0 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return mathIncreasedOdForWholeElementTotal(values, "barrier");
};

const mathIncreasedOdForWholeElement0 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return mathIncreasedOdForWholeElement(values, "barrier");
};

const mathIncreasedOdForEndsTotal0 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return mathIncreasedOdForEndsTotal(values, "barrier");
};

const mathIncreasedOdForEnds0 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return increasedOdForEnds(values, "barrier");
};
const mathIncreasedOdForWholeElementTotal1 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return mathIncreasedOdForWholeElementTotal(values, "barrierPinSide");
};

const mathIncreasedOdForWholeElement1 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return mathIncreasedOdForWholeElement(values, "barrierPinSide");
};

const mathIncreasedOdForEndsTotal1 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return mathIncreasedOdForEndsTotal(values, "barrierPinSide");
};

const mathIncreasedOdForEnds1 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return increasedOdForEnds(values, "barrierPinSide");
};
const mathIncreasedOdForWholeElementTotal2 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return mathIncreasedOdForWholeElementTotal(values, "barrierBoxSide");
};

const mathIncreasedOdForWholeElement2 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return mathIncreasedOdForWholeElement(values, "barrierBoxSide");
};

const mathIncreasedOdForEndsTotal2 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return mathIncreasedOdForEndsTotal(values, "barrierBoxSide");
};

const mathIncreasedOdForEnds2 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return increasedOdForEnds(values, "barrierBoxSide");
};

const mathTargetMeasurement = (
  values,
  repeatStepList,
  decimal,
  specData,
  func,
  path
) => {
  let targetMeasurement = objectPath.get(values, path, 0);
  targetMeasurement = targetMeasurement === "" ? 0 : targetMeasurement;
  let increasedOdForWholeElementTotal = func(specData, repeatStepList, decimal);
  if (increasedOdForWholeElementTotal) {
    increasedOdForWholeElementTotal = Number(
      increasedOdForWholeElementTotal.split("m")[0]
    );
  } else {
    increasedOdForWholeElementTotal = 0;
  }
  return whatTooReturn(
    targetMeasurement + increasedOdForWholeElementTotal,
    decimal,
    [targetMeasurement, increasedOdForWholeElementTotal]
  );
};

const mathTargetMeasurement0 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return mathTargetMeasurement(
    values,
    repeatStepList,
    decimal,
    specData,
    mathIncreasedOdForWholeElementTotal0,
    `operator.measurementPointBeforeBarriers.${repeatStepList[0]}.data.measurementPointBeforeAppliedBarrier`
  );
};

const mathTargetMeasurementPinSide = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return mathTargetMeasurement(
    values,
    repeatStepList,
    decimal,
    specData,
    mathIncreasedOdForWholeElementTotal1,
    `operator.measurementPointBeforeBarrierPinSides.${repeatStepList[0]}.data.measurementPointBeforeAppliedBarrierPinSide`
  );
};

const mathTargetMeasurementBoxSide = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null,
  specData = null
) => {
  return mathTargetMeasurement(
    values,
    repeatStepList,
    decimal,
    specData,
    mathIncreasedOdForWholeElementTotal2,
    `operator.measurementPointBeforeBarrierBoxSides.${repeatStepList[0]}.data.measurementPointBeforeAppliedBarrierBoxSide`
  );
};

const mathTorque = (values, repeatStepList, decimal) => {
  let screwSize = findValue(values, `leadEngineer.data.screwSize`);
  let screwLength = findValue(values, `leadEngineer.data.screwLength`);
  let steel = findValue(values, `leadEngineer.data.steel`);
  if (steel === "Carbon - Q125") {
    return 125;
  }
  if (screwSize === "M10") {
    if (10 <= screwLength <= 13) {
      return 25;
    } else if (screwLength <= 20) {
      return 45;
    }
  } else if (screwSize === "M16") {
    return 110;
  }
};

const increasedOdForEndsMinMax = (values, field) => {
  let barrier = objectPath.get(values, `leadEngineer.data.${field}`, "");
  return barrier && barrierCriteria[barrier]
    ? barrierCriteria[barrier].increasedOdForEnds
    : {};
};
const mathIncreasedOdForWholeElementMinMax = (values, field) => {
  let barrier = objectPath.get(values, `leadEngineer.data.${field}`, "");
  return barrier && barrierCriteria[barrier]
    ? barrierCriteria[barrier].increasedOdForWholeElement
    : {};
};

const mathBarrierMinMax = (data, path, barrier) => {
  let measurementPoint = objectPath.get(data, path, 0);
  measurementPoint = measurementPoint ? measurementPoint : 0;
  return whatTooReturn(measurementPoint + barrier, 2, [
    measurementPoint,
    barrier
  ]);
};

const mathBarrierPinSidePinSideMin = (
  allData,
  data,
  repeatStepList,
  documentData
) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarrierPinSides.${repeatStepList[0]}.data.measurementPointBoxBeforeAppliedBarrierPinSide`,
    increasedOdForEndsMinMax(data, "barrierPinSide").min
  );
};

const mathBarrierBoxSidePinSideMin = (
  allData,
  data,
  repeatStepList,
  documentData
) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarrierPinSides.${repeatStepList[0]}.data.measurementPointPinBeforeAppliedBarrierPinSide`,
    increasedOdForEndsMinMax(data, "barrierPinSide").min
  );
};

const mathBarrierPinSidePinSideMax = (
  allData,
  data,
  repeatStepList,
  documentData
) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarrierPinSides.${repeatStepList[0]}.data.measurementPointBoxBeforeAppliedBarrierPinSide`,
    increasedOdForEndsMinMax(data, "barrierPinSide").max
  );
};

const mathBarrierBoxSidePinSideMax = (
  allData,
  data,
  repeatStepList,
  documentData
) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarrierPinSides.${repeatStepList[0]}.data.measurementPointPinBeforeAppliedBarrierPinSide`,
    increasedOdForEndsMinMax(data, "barrierPinSide").max
  );
};

const mathBarrierPinSideBoxSideMin = (
  allData,
  data,
  repeatStepList,
  documentData
) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarrierBoxSides.${repeatStepList[0]}.data.measurementPointPinBeforeAppliedBarrierBoxSide`,
    increasedOdForEndsMinMax(data, "barrierBoxSide").min
  );
};

const mathBarrierBoxSideBoxSideMin = (
  allData,
  data,
  repeatStepList,
  documentData
) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarrierBoxSides.${repeatStepList[0]}.data.measurementPointBoxBeforeAppliedBarrierBoxSide`,
    increasedOdForEndsMinMax(data, "barrierBoxSide").min
  );
};

const mathBarrierPinSideBoxSideMax = (
  allData,
  data,
  repeatStepList,
  documentData
) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarrierBoxSides.${repeatStepList[0]}.data.measurementPointPinBeforeAppliedBarrierBoxSide`,
    increasedOdForEndsMinMax(data, "barrierBoxSide").max
  );
};

const mathBarrierBoxSideBoxSideMax = (
  allData,
  data,
  repeatStepList,
  documentData
) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarrierBoxSides.${repeatStepList[0]}.data.measurementPointBoxBeforeAppliedBarrierBoxSide`,
    increasedOdForEndsMinMax(data, "barrierBoxSide").max
  );
};
const mathBarrierPinSideMin = (allData, data, repeatStepList, documentData) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarriers.${repeatStepList[0]}.data.measurementPointPinBeforeAppliedBarrier`,
    increasedOdForEndsMinMax(data, "barrier").min
  );
};

const mathBarrierBoxSideMin = (allData, data, repeatStepList, documentData) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarriers.${repeatStepList[0]}.data.measurementPointBoxBeforeAppliedBarrier`,
    increasedOdForEndsMinMax(data, "barrier").min
  );
};

const mathBarrierPinSideMax = (allData, data, repeatStepList, documentData) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarriers.${repeatStepList[0]}.data.measurementPointPinBeforeAppliedBarrier`,
    increasedOdForEndsMinMax(data, "barrier").max
  );
};

const mathBarrierBoxSideMax = (allData, data, repeatStepList, documentData) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarriers.${repeatStepList[0]}.data.measurementPointBoxBeforeAppliedBarrier`,
    increasedOdForEndsMinMax(data, "barrier").max
  );
};

const mathBarrier0Min = (allData, data, repeatStepList, documentData) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementOfEndsBeforeAppliedBarrier`,
    increasedOdForEndsMinMax(data, "barrier").min
  );
};

const mathBarrier0Max = (allData, data, repeatStepList, documentData) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementOfEndsBeforeAppliedBarrier`,
    increasedOdForEndsMinMax(data, "barrier").max
  );
};
const mathBarrier1Min = (allData, data, repeatStepList, documentData) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarriers.${repeatStepList[0]}.data.measurementPointBeforeAppliedBarrier`,
    mathIncreasedOdForWholeElementMinMax(data, "barrier").min
  );
};

const mathBarrier1Max = (allData, data, repeatStepList, documentData) => {
  return mathBarrierMinMax(
    documentData,
    `operator.measurementPointBeforeBarriers.${repeatStepList[0]}.data.measurementPointBeforeAppliedBarrier`,
    mathIncreasedOdForWholeElementMinMax(data, "barrier").max
  );
};

const Math = {
  mathMin,
  mathMax,
  mathMouldThickness,
  mathLayerMinMax,
  mathLayerMin,
  mathLayerMax,
  mathBarrier1Min,
  mathBarrier1Max,
  mathBarrier0Min,
  mathBarrier0Max,
  mathBarrierPinSideMin,
  mathBarrierBoxSideMin,
  mathBarrierPinSideMax,
  mathBarrierBoxSideMax,
  mathBarrierPinSideBoxSideMin,
  mathBarrierPinSideBoxSideMax,
  mathBarrierBoxSideBoxSideMin,
  mathBarrierBoxSideBoxSideMax,
  mathBarrierPinSidePinSideMin,
  mathBarrierPinSidePinSideMax,
  mathBarrierBoxSidePinSideMin,
  mathBarrierBoxSidePinSideMax,
  mathTargetMeasurementBoxSide,
  mathTargetMeasurementPinSide,
  mathTargetMeasurement0,
  mathTorque,
  mathIncreasedOdForEnds2,
  mathIncreasedOdForEndsTotal2,
  mathIncreasedOdForWholeElement2,
  mathIncreasedOdForWholeElementTotal2,
  mathIncreasedOdForEnds1,
  mathIncreasedOdForEndsTotal1,
  mathIncreasedOdForWholeElement1,
  mathIncreasedOdForWholeElementTotal1,
  mathIncreasedOdForEnds0,
  mathIncreasedOdForEndsTotal0,
  mathIncreasedOdForWholeElement0,
  mathIncreasedOdForWholeElementTotal0,
  mathScrewDescription,
  mathDescription,
  mathCompoundNoId,
  mathProgramNumber,
  mathPackingSpecification,
  mathCoreSampleCode,
  mathMeasurementPointsPinSide,
  mathMeasurementPointsBoxSide,
  mathMeasurementPoints,
  mathShrinkThickness,
  mathToleranceMin,
  mathToleranceMax,
  mathQualityControlMeasurementPointCoatingItemMin,
  mathQualityControlMeasurementPointCoatingItemMax,
  mathQualityControlMeasurementPointMouldMin,
  mathQualityControlMeasurementPointMouldMax,
  mathLayer,
  mathMeasurementPointMin,
  mathMeasurementPointMax,
  mathPeelTest
};

export default Math;
