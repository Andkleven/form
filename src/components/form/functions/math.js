import {
  allZeroOrNaN,
  findValue,
  lowerCaseFirstLetter,
  removeSpace
} from "../../../functions/general";
import objectPath from "object-path";

const whatTooReturn = (value, decimal, array = [true]) => {
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
  return whatTooReturn(value, decimal, [toleranceMin, measurementPointActual]);
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
  return whatTooReturn(value, decimal, [toleranceMax, measurementPointActual]);
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
  let toleranceMin = Number(mathMin(allData["items"][0], repeatStepList, 0));
  return qualityControlMeasurementPointCoatingItem(
    allData,
    repeatStepList,
    toleranceMin,
    1
  );
};
const mathQualityControlMeasurementPointCoatingItemMax = (
  allData,
  data,
  repeatStepList
) => {
  let toleranceMax = Number(mathMax(allData["items"][0], repeatStepList, 0));
  return qualityControlMeasurementPointCoatingItem(
    allData,
    repeatStepList,
    toleranceMax,
    1
  );
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
  jsonVariables = null
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
  jsonVariables = null
) => {
  let toleranceMinPercent = Number(
    findValue(values, "leadEngineer.data.toleranceMinPercent")
  );

  let orderedTotalRubberThickness = Number(
    findValue(values, "leadEngineer.data.orderedTotalRubberThickness")
  );
  return whatTooReturn(
    orderedTotalRubberThickness -
      (orderedTotalRubberThickness * toleranceMinPercent) / 100,
    decimal,
    [toleranceMinPercent, orderedTotalRubberThickness]
  );
};

const mathMax = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  let toleranceMaxPercent = Number(
    findValue(values, "leadEngineer.data.toleranceMaxPercent")
  );
  let orderedTotalRubberThickness = Number(
    findValue(values, "leadEngineer.data.orderedTotalRubberThickness")
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
      `leadEngineer.vulcanizationSteps.${index}.coatingLayers`
    ).length;
  }
  layers += repeatStepList[1] + 1;
  return layers;
};

const mathMeasurementPoint = (data, repeatStepList) => {
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

const mathMeasurementPointMin = (allData, data, repeatStepList) => {
  let layerThickness = mathMeasurementPoint(data, repeatStepList);
  let toleranceMinPercent = Number(
    objectPath.get(data, `leadEngineer.data.toleranceMinPercent`)
  );
  return layerThickness - (layerThickness * toleranceMinPercent) / 100;
};

const mathMeasurementPointMax = (allData, data, repeatStepList) => {
  let layerThickness = mathMeasurementPoint(data, repeatStepList);
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
  jsonVariables = null
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
  return Number(String(number).split(".")[0]);
};

const mathMeasurementPoints = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
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
  jsonVariables = null
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
  jsonVariables = null
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
  compoundNo1compoundNo2: {
    "35-406335-5265": {
      geometry: "WS NT/OS",
      compoundNoPinSide: "35-4063",
      programNumber: "14",
      coreSampleCode: "A/M",
      packingSpecification: "PP4"
    },
    "35-526535-4064": {
      geometry: "OS/WS LT",
      compoundNoPinSide: "35-5265",
      programNumber: "14",
      coreSampleCode: "M/B",
      packingSpecification: "PP3"
    },
    "35-406335-5265/5266": {
      geometry: "WS NT/OS L",
      compoundNoPinSide: "35-4063",
      programNumber: "14",
      coreSampleCode: "A/N",
      packingSpecification: "PP4"
    },
    "35-5265/526635-4046": {
      geometry: "OS L/ WS LT",
      compoundNoPinSide: "35-5265/5266",
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
  return getType(values, jsonVariables, "compoundNoPinSide");
};

const mathDescription = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  let geometry = removeSpace(lowerCaseFirstLetter(jsonVariables[0]));
  let rubberType = getType(values, jsonVariables, "geometry");
  let elementLength =
    objectPath.get(values, `leadEngineer.data.elementLength`, "") / 1000;
  if (elementLength) {
    elementLength = floor(elementLength);
  }
  let pipeOd = objectPath.get(values, `leadEngineer.data.pipeOd`, "");
  let rubberOd = objectPath.get(values, `leadEngineer.data.rubberOd`, "");
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
  if (jsonVariables[0] === "dual") {
    return `${K2 ? "K2" : ""} ${
      rubberOd && pipeOd ? jsonVariables[0] : ""
    } ${rubberType} ${barrierPinSide}x${elementLength}M ${
      barrierBoxSide ? `/ ${geometry} ${barrierBoxSide}x${elementLength}M` : ""
    } ${pipeOd}/${rubberOd}`;
  } else {
    return `${K2 ? "K2" : ""} ${
      jsonVariables[0]
    } ${rubberType} ${barrierPinSide} ${
      cable && `CL${numberOfTracks}`
    } ${pipeOd}/${rubberOd} x ${elementLength}M`;
  }
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
const mathIncreasedOdForWholeElementTotal1 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  return mathIncreasedOdForWholeElementTotal(values, "barrierPinSide");
};

const mathIncreasedOdForWholeElement1 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  return mathIncreasedOdForWholeElement(values, "barrierPinSide");
};

const mathIncreasedOdForEndsTotal1 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  return mathIncreasedOdForEndsTotal(values, "barrierPinSide");
};

const mathIncreasedOdForEnds1 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  return increasedOdForEnds(values, "barrierPinSide");
};
const mathIncreasedOdForWholeElementTotal2 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  return mathIncreasedOdForWholeElementTotal(values, "barrierBoxSide");
};

const mathIncreasedOdForWholeElement2 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  return mathIncreasedOdForWholeElement(values, "barrierBoxSide");
};

const mathIncreasedOdForEndsTotal2 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  return mathIncreasedOdForEndsTotal(values, "barrierBoxSide");
};

const mathIncreasedOdForEnds2 = (
  values,
  repeatStepList,
  decimal,
  mathStore = null,
  jsonVariables = null
) => {
  return increasedOdForEnds(values, "barrierBoxSide");
};

const Math = {
  mathMouldThickness,
  mathLayerMinMax,
  mathLayerMin,
  mathLayerMax,
  mathIncreasedOdForEnds2,
  mathIncreasedOdForEndsTotal2,
  mathIncreasedOdForWholeElement2,
  mathIncreasedOdForWholeElementTotal2,
  mathIncreasedOdForEnds1,
  mathIncreasedOdForEndsTotal1,
  mathIncreasedOdForWholeElement1,
  mathIncreasedOdForWholeElementTotal1,
  mathScrewDescription,
  mathDescription,
  mathCompoundNo1,
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
