import objectPath from "object-path";
const cloneDeep = require("clone-deep");

const ultrasound = {
  pages: [
    {
      fields: [
        {
          fieldName: "ultraSoundGrinding",
          label: "Ultra sound grinding",
          type: "select",
          required: true,
          options: ["Before", "After"]
        },
        {
          fieldName: "probe",
          required: true,
          label: "Probe"
        },
        {
          fieldName: "equipmentName",
          required: true,
          label: "Equipment name"
        },
        {
          fieldName: "ultrasoundEquipmentId",
          required: true,
          label: "Equipment ID"
        },
        {
          fieldName: "calibrationDate",
          required: true,
          label: "Next Calibration date",
          type: "date"
        },
        {
          fieldName: "deviation",
          label: "Deviation",
          type: "checkbox"
        },
        {
          writeOnlyFieldIf: "operator.data.deviation",
          viewPdf: true
        }
      ]
    },
    {
      fields: [
        {
          fieldName: "deviation",
          required: true,
          label: "Deviation"
        }
      ]
    },
    {
      fields: [
        {
          writeOnlyFieldIf: "operator.data.deviation",
          fieldName: "length",
          required: true,
          label: "Length",
          type: "number",
          unit: "mm"
        },
        {
          writeOnlyFieldIf: "operator.data.deviation",
          fieldName: "depth",
          required: true,
          label: "Depth"
        },
        {
          writeOnlyFieldIf: "operator.data.deviation",
          fieldName: "size",
          required: true,
          label: "Size"
        },
        {
          fieldName: "approved",
          required: true,
          label: "Approved",
          type: "checkbox"
        },
        {
          fieldName: "inspectorsCertificateNo",
          required: true,
          label: "Inspectors certificate no."
        },
        {
          fieldName: "inspectorsCertificateDueDate",
          required: true,
          label: "Inspectors certificate due date",
          type: "date"
        }
      ]
    }
  ]
};
function addNameToFieldName(stringToAdd, fields) {
  let newFields = cloneDeep(fields);
  fields.forEach((field, indexField) => {
    if (field.fieldName) {
      objectPath.set(
        newFields,
        `${indexField}.fieldName`,
        `${field.fieldName}${stringToAdd}`
      );
    }
  });
  return newFields;
}
console.log({ fields: [...ultrasound.pages[2].fields] });
const grindingField = [
  {
    showField: { b2P: true },
    fieldName: "elementLengthAfterGrinding",
    required: true,
    label: "Element length after grinding",
    unit: "mm",
    type: "number",
    subtext: "Target thickness: {}mm",
    mathSubtext: "mathTargetThickness"
  },
  {
    showField: { dual: true },
    labelOnly: true,
    label: "Pin Side"
  },
  {
    showField: { dual: true },
    fieldName: "elementLengthAfterGrindingPinSide",
    required: true,
    label: "Element length after grinding pin side",
    unit: "mm",
    type: "number",
    subtext: "Target thickness: {}mm",
    mathSubtext: "mathTargetThicknessPin"
  },
  {
    showField: { dual: true },
    fieldName: "elementCenterDiameterPinSide",
    required: true,
    label: "Element center diameter pin side",
    type: "number"
  },
  {
    showField: { dual: true },
    fieldName: "pinDiameterPinSide",
    required: true,
    label: "Pin diameter pin side"
  },
  {
    showField: { dual: true },
    fieldName: "boxDiameterPinSide",
    required: true,
    label: "Box diameter pin side"
  },
  {
    showField: { dual: true },
    labelOnly: true,
    label: "Box Side"
  },
  {
    showField: { dual: true },
    fieldName: "elementLengthAfterGrindingBoxSide",
    required: true,
    label: "Element length after grinding box side",
    unit: "mm",
    type: "number",
    subtext: "Target thickness: {}mm",
    mathSubtext: "mathTargetThicknessBox"
  },
  {
    showField: { dual: true },
    fieldName: "elementCenterDiameterBoxSide",
    required: true,
    label: "Element center diameter box side",
    type: "number"
  },
  {
    showField: { dual: true },
    fieldName: "pinDiameterBoxSide",
    required: true,
    label: "Pin diameter box side"
  },
  {
    showField: { dual: true },
    fieldName: "boxDiameterBoxSide",
    required: true,
    label: "Box diameter box side"
  },
  {
    showField: { b2P: true },
    fieldName: "elementCenterDiameter",
    required: true,
    label: "Element center diameter",
    type: "number"
  },
  {
    showField: { b2P: true },
    fieldName: "pinDiameter",
    required: true,
    label: "Pin diameter"
  },
  {
    showField: { b2P: true },
    fieldName: "boxDiameter",
    required: true,
    label: "Box diameter"
  },
  {
    showField: { slipon3: true, slipon2: true },
    fieldName: "odLength1",
    required: true,
    label: "OD length 1"
  },
  {
    showField: { slipon3: true, slipon2: true },
    fieldName: "odLength2",
    required: true,
    label: "OD length 2"
  },
  {
    showField: { slipon3: true, slipon2: true },
    fieldName: "odLength3",
    required: true,
    label: "OD length 3"
  },
  {
    fieldName: "equipmentIdGrinding",
    required: true,
    label: "Equipment ID"
  },
  {
    label: "Core Sample",
    mathSpec: "mathCoreSampleCode"
  },
  {
    showField: { slipon3: true, slipon2: true, b2P: true },
    fieldName: "coreSample",
    label: "Core Sample",
    mathSubtext: "mathCoreSampleCode",
    type: "checkbox"
  },
  {
    showField: { dual: true },
    fieldName: "coreSamplePinSide",
    label: "Core sample pin side",
    mathSubtext: "mathCoreSampleCode",
    type: "checkbox"
  },
  {
    showField: { dual: true },
    fieldName: "coreSampleBoxSide",
    label: "Core sample box side",
    mathSubtext: "mathCoreSampleCode",
    type: "checkbox"
  }
];

const barrier1To2 = [
  "1A",
  "2A",
  "3A",
  "4A",
  "5A",
  "6A",
  "7A",
  "8A",
  "1B",
  "2B",
  "3B",
  "4B",
  "5B",
  "6B",
  "7B",
  "8B",
  "1C",
  "2C",
  "3C",
  "4C",
  "5C",
  "6C",
  "7C",
  "8C"
];

const barrier0 = ["0A", "0B", "0C"];

export default {
  mutation: "OPERATOR",
  query: "GET_OPERATOR_BY_ITEM",
  chapterByStage: true,
  getNewValue: "operator.new.item",
  getOldValue: "items",
  chapters: {
    steelMeasurement: {
      queryPath: "operator",
      pages: [
        {
          pageTitle: "Steel measurement",
          queryPath: "operator",
          fields: [
            {
              fieldName: "measurementPoint",
              label: "Measurement Point",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            }
          ]
        }
      ]
    },
    actualSteelMeasurement: {
      showChapter: { coatedItem: true },
      queryPath: "operator",
      pages: [
        {
          queryVariableLabel: "leadEngineer.data.targetDescriptionValue",
          variableLabelSpec: true,
          pageTitle: "Actual Steel {}",
          queryPath: "operator.measurementPointActualTdvs",
          repeatGroupWithQuery: "leadEngineer.data.measurementPoint",
          repeatGroupWithQuerySpecData: true,
          fields: [
            {
              queryVariableLabel: [
                "leadEngineer.measurementPointActualTdvs",
                "data.referencePoint"
              ],
              variableLabelSpec: true,
              fieldName: "measurementPointActual",
              label: "Measurement Point Reference: {}",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            }
          ]
        }
      ]
    },
    steelPreparation1: {
      queryPath: "operator",
      pages: [
        {
          pageTitle: "Media Blasting",
          queryPath: "operator",
          fields: [
            {
              specValueList: "leadEngineer.data.blastMedia",
              label: "Blast Media"
            },
            {
              fieldName: "relativeHumidity",
              label: "Relative Humidity",
              required: true,
              routeToSpecMax: "leadEngineer.data.relativeHumidity",
              type: "number",
              unit: "%"
            },
            {
              fieldName: "airTemperature",
              label: "Air Temperature",
              routeToSpecMin: "leadEngineer.data.airTemperature",
              unit: "°C",
              type: "number",
              required: true
            },
            {
              fieldName: "steelTemperature",
              label: "Steel Temperature",
              routeToSpecMin: "leadEngineer.data.steelTemperature",
              unit: "°C",
              type: "number",
              required: true
            },
            {
              fieldName: "dewPoint",
              label: "Dew Point",
              routeToSpecMin: "leadEngineer.data.dewPoint",
              unit: "°C",
              type: "number",
              required: true
            },
            {
              fieldName: "temperatureOverDewPoint",
              label: "Temperature over Dew Point",
              routeToSpecMin: "leadEngineer.data.temperatureOverDewPoint",
              unit: "°C",
              type: "number",
              required: true
            },
            {
              fieldName: "equipmentIDMediaBlasting",
              required: true,
              label: "Equipment ID"
            },
            {
              fieldName: "nextCalibrationDateMediaBlasting",
              required: true,
              label: "Next Calibration Date",
              type: "date"
            },
            {
              fieldName: "steelPreparationPerformed",
              label: "Steel Preparation Performed",
              required: true,
              type: "datetime-local"
            },
            {
              fieldName: "mediaBlastingStarted",
              required: true,
              label: "Media Blasting Started",
              type: "datetime-local"
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "blastMediaBatchNumber",
              required: true,
              label: "Blast Media Batch Number"
            }
          ]
        }
      ]
    },
    steelPreparation2: {
      queryPath: "operator",
      pages: [
        {
          pageTitle: "Media Blasting Additional Tests",
          queryPath: "operator",
          fields: [
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "inspectionOfSteelSurface",
              showFieldSpecPath: "leadEngineer.data.inspectionOfSteelSurface",
              label: "Inspection of Steel Surface",
              subtext: "ISO 8501-3, Welds to be grade P3",
              required: true,
              type: "checkbox"
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "solubleSaltLevel",
              label: "Soluble Salt Level",
              showFieldSpecPath: "leadEngineer.data.solubleSaltLevel",
              routeToSpecMax: "leadEngineer.data.solubleSaltLevel",
              placeholder: "Result",
              unit: "mg/m²",
              required: true,
              type: "number"
            },
            {
              showField: { coatedItem: true, mould: true },
              showFieldSpecPath: "leadEngineer.data.solubleSaltLevel",
              fieldName: "equipmentIDSolubleSaltLevel",
              required: true,
              prepend: "Equipment ID"
            },
            {
              showField: { coatedItem: true, mould: true },
              showFieldSpecPath: "leadEngineer.data.solubleSaltLevel",
              fieldName: "nextCalibrationDateSolubleSaltLevel",
              prepend: "Next Calibration Date",
              type: "date",
              required: true
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "surfaceCleanliness",
              label: "Surface Cleanliness",
              showFieldSpecPath: "leadEngineer.data.surfaceCleanliness",
              subtext: "ISO 8501-1, Min. Sa 2,5 (Rust grade A or B)",
              required: true,
              unit: "Sa"
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "surfaceCleanlinessImage",
              placeholder: "Upload Image",
              showFieldSpecPath: "leadEngineer.data.surfaceCleanliness",
              indent: true,
              label: "Surface Cleanliness Image",
              type: "file"
            },
            {
              showField: { coatedItem: true, mould: true },
              showFieldSpecPath: "leadEngineer.data.compressedAirCheck",
              fieldName: "compressedAirCheck",
              label: "Compressed Air Check",
              subtext: "ASTM D 4285, No oil and no water",
              required: true,
              type: "checkbox"
            },
            {
              showField: { coatedItem: true, mould: true },
              showFieldSpecPath: "leadEngineer.data.compressedAirCheck",
              fieldName: "equipmentIdCompressedAirCheck",
              required: true,
              prepend: "Equipment ID"
            },
            {
              showField: { coatedItem: true, mould: true },
              showFieldSpecPath: "leadEngineer.data.compressedAirCheck",
              fieldName: "nextCalibrationDateCompressedAirCheck",
              type: "date",
              prepend: "Next Calibration Date",
              required: true
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "uvTest",
              showFieldSpecPath: "leadEngineer.data.uvTest",
              label: "UV Test",
              required: true,
              subtext: "No reflecting light",
              type: "checkbox"
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "equipmentIDUvTest",
              showFieldSpecPath: "leadEngineer.data.uvTest",
              required: true,
              prepend: "Equipment ID"
            },
            {
              showField: { coatedItem: true, mould: true },
              showFieldSpecPath: "leadEngineer.data.uvTest",
              fieldName: "nextCalibrationDateUvTest",
              type: "date",
              prepend: "Next Calibration Date",
              required: true
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "blastMediaConductivity",
              showFieldSpecPath: "leadEngineer.data.blastMediaConductivity",
              label: "Blast Media Conductivity",
              routeToSpecMax: "leadEngineer.data.blastMediaConductivity",
              placeholder: "Result",
              required: true,
              unit: "µS/cm",
              type: "number"
            },
            {
              showField: { coatedItem: true, mould: true },
              showFieldSpecPath: "leadEngineer.data.blastMediaConductivity",
              required: true,
              fieldName: "equipmentIDBlastMediaConductivity",
              prepend: "Equipment ID"
            },
            {
              showField: { coatedItem: true, mould: true },
              showFieldSpecPath: "leadEngineer.data.blastMediaConductivity",
              fieldName: "nextCalibrationDateBlastMediaConductivity",
              type: "date",
              prepend: "Next Calibration Date",
              required: true
            },
            {
              fieldName: "surfaceProfileRoughness",
              showFieldSpecPath: "leadEngineer.data.surfaceProfileMax",
              required: true,
              placeholder: "Result",
              label: "Surface Profile (Roughness)",
              routeToSpecMin: "leadEngineer.data.surfaceProfileMin",
              routeToSpecMax: "leadEngineer.data.surfaceProfileMax",
              unit: "Rz",
              type: "number"
            },
            {
              showFieldSpecPath: "leadEngineer.data.surfaceProfileMin",
              required: true,
              fieldName: "equipmentIDSurfaceProfileRoughness",
              prepend: "Equipment ID"
            },
            {
              showFieldSpecPath: "leadEngineer.data.surfaceProfileMin",
              fieldName: "nextCalibrationDateSurfaceProfileRoughness",
              type: "date",
              prepend: "Next Calibration Date",
              required: true
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "dustTest",
              label: "Dust Test",
              required: true,
              prepend: "Max",
              min: 1,
              max: 5,
              placeholder: "Result",
              showFieldSpecPath: "leadEngineer.data.dustTest",
              routeToSpecMax: "leadEngineer.data.dustTest",
              type: "number"
            },
            {
              fieldName: "mediaBlastingTestsFinished",
              required: true,
              label: "Media Blasting Tests Finished",
              type: "datetime-local"
            }
          ]
        },
        {
          repeatGroupWithQuerySpecData: true,
          repeatGroupWithQuery: "leadEngineer.additionalCustomTests",
          queryPath: "operator.additionalCustomTestOperators",
          fields: [
            {
              specValueList: [
                "leadEngineer.additionalCustomTests",
                "data.name"
              ],
              label: "Custom Test Name"
            },
            {
              specValueList: [
                "leadEngineer.additionalCustomTests",
                "data.criteria"
              ],
              label: "Custom Test Criteria"
            },
            {
              fieldName: "test",
              label: "Test",
              required: true
            }
          ]
        }
      ]
    },
    primer1: {
      queryPath: "operator",
      pages: [
        {
          pageTitle: "Priming 1",
          queryPath: "operator",
          fields: [
            {
              showField: { slipon2: true, slipon3: true },
              text: "Internal and external priming",
              label: ""
            },
            {
              specValueList: "leadEngineer.data.primer1",
              label: "Primer Number"
            },
            {
              fieldName: "batchNumberPriming1",
              required: true,
              label: "Batch Number",
              type: "number"
            },
            {
              fieldName: "startTimePriming1",
              required: true,
              label: "Start Time",
              type: "datetime-local"
            },
            {
              fieldName: "stopTimePriming1",
              required: true,
              label: "Stop Time",
              type: "datetime-local"
            }
          ]
        }
      ]
    },
    primer2: {
      queryPath: "operator",
      pages: [
        {
          pageTitle: "Priming 2",
          queryPath: "operator",
          fields: [
            {
              showField: { slipon2: true, slipon3: true },
              text: "Internal and external priming",
              label: ""
            },
            {
              specValueList: "leadEngineer.data.primer2",
              label: "Primer Number:"
            },
            {
              fieldName: "batchNumberPriming2",
              required: true,
              label: "Batch Number",
              type: "number"
            },
            {
              fieldName: "startTimePriming2",
              required: true,
              label: "Start Time",
              type: "datetime-local"
            },
            {
              fieldName: "stopTimePriming2",
              required: true,
              label: "Stop Time",
              type: "datetime-local"
            }
          ]
        }
      ]
    },
    itemRubberCementsBeforeCoating: {
      queryPath: "operator",
      pages: [
        {
          pageTitle: "Item Rubber Cement Before Coating",
          queryPath: "operator",
          fields: [
            {
              specValueList: "leadEngineer.data.itemRubberCementsBeforeCoating",
              label: "Item Rubber Cement:"
            },
            {
              fieldName: "itemRubberCementsBeforeCoatingMixDate",
              required: true,
              label: "Mix Date",
              type: "date"
            },
            {
              fieldName: "startTimeItemRubberCement",
              required: true,
              label: "Start Time",
              type: "datetime-local"
            },
            {
              fieldName: "stopTimeItemRubberCement",
              required: true,
              label: "Stop Time",
              type: "datetime-local"
            }
          ]
        }
      ]
    },
    releaseCementsBeforeCoating: {
      queryPath: "operator",
      pages: [
        {
          pageTitle: "Release Cements Before Coating",
          queryPath: "operator",
          fields: [
            {
              specValueList: "leadEngineer.data.releaseCementsBeforeCoating",
              label: "Rubber Agent"
            },
            {
              fieldName: "rubberCementsBeforeCoatingMixDate",
              required: true,
              label: "Mix Date",
              type: "date"
            },
            {
              fieldName: "startTimeRubberCement",
              required: true,
              label: "Start Time",
              type: "datetime-local"
            },
            {
              fieldName: "stopTimeRubberCement",
              required: true,
              label: "Stop Time",
              type: "datetime-local"
            }
          ]
        }
      ]
    },
    coating: {
      queryPath: "operator",
      pages: [
        {
          pageTitle: "Coating",
          repeatGroupWithQuerySpecData: true,
          repeatGroupWithQuery: "leadEngineer.ringMaterials",
          fields: [
            {
              specValueList: [
                "leadEngineer.ringMaterials",
                "data.ringMaterial"
              ],
              variableLabelSpec: true,
              queryVariableLabel: [
                "leadEngineer.ringMaterials",
                "data.ringType"
              ],
              label: "{} material no"
            }
          ]
        },
        {
          queryPath: "operator",
          fields: [
            {
              fieldName: "ringAssembled",
              label: "Ring assembled",
              type: "select",
              options: ["Ring assembled", "Stringer(PXP)"],
              required: true
            }
          ]
        },
        {
          queryPath: "operator",
          fields: [
            {
              showField: { dual: true },
              specValueList: "leadEngineer.data.compoundNoPinSide",
              required: true,
              label: "Rubber pin side"
            },
            {
              showField: { dual: true },
              required: true,
              fieldName: "compoundNoPinSideBatchNo",
              label: "Batch no"
            },
            {
              showField: { dual: true },
              fieldName: "compoundNoPinSideMixDate",
              label: "Mix date",
              required: true,
              type: "date"
            },
            {
              showField: { dual: true },
              specValueList: "leadEngineer.data.compoundNoBoxSide",
              required: true,
              label: "Rubber box side"
            },
            {
              showField: { dual: true },
              fieldName: "compoundNoBoxSideBatchNo",
              required: true,
              label: "Batch no"
            },
            {
              showField: { dual: true },
              fieldName: "compoundNoBoxSideMixDate",
              label: "Mix date",
              required: true,
              type: "date"
            },
            {
              showField: { b2P: true },
              specValueList: "leadEngineer.data.compoundNoRubberType",
              required: true,
              label: "Rubber"
            },
            {
              showField: { b2P: true },
              fieldName: "compoundNoRubberTypeBatchNo",
              label: "Batch no"
            },
            {
              showField: { b2P: true },
              fieldName: "compoundNoRubberTypeMixDate",
              label: "Mix date",
              required: true,
              type: "date"
            },
            {
              showField: { slipon2: true, slipon3: true },
              mathSpec: "mathCompoundNoId",
              required: true,
              label: "ID Rubber"
            },
            {
              showField: { slipon2: true, slipon3: true },
              fieldName: "compoundNoIdBatchNo",
              required: true,
              label: "Batch no"
            },
            {
              showField: { slipon2: true, slipon3: true },
              fieldName: "compoundNoIdMixDate",
              label: "Mix date",
              required: true,
              type: "date"
            },
            {
              showField: { slipon2: true, slipon3: true },
              fieldName: "IdRubberThickness",
              label: "ID Rubber thickness",
              notBatch: true,
              unit: "mm",
              required: true,
              type: "number"
            },
            {
              showField: { slipon2: true, slipon3: true },
              specValueList: "leadEngineer.data.compoundNoOd",
              required: true,
              label: "OD Rubber"
            },
            {
              showField: { slipon2: true, slipon3: true },
              fieldName: "compoundNoOdBatchNo",
              required: true,
              label: "Batch no"
            },
            {
              showField: { slipon2: true, slipon3: true },
              fieldName: "compoundNoOdMixDate",
              label: "Mix date",
              required: true,
              type: "date"
            },
            {
              showField: { slipon2: true, slipon3: true },
              fieldName: "OdRubberThickness",
              label: "OD Rubber thickness",
              notBatch: true,
              unit: "mm",
              required: true,
              type: "number"
            },
            {
              showField: { b2P: true },
              fieldName: "builtThickness",
              label: "Built thickness",
              routeToSpecMin: "leadEngineer.data.packerElementOd1Min",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            },
            {
              showField: { dual: true },
              fieldName: "builtThicknessPinSide",
              label: "Built thickness pin side",
              routeToSpecMin: "leadEngineer.data.packerElementOd1Min",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            },
            {
              showField: { dual: true },
              fieldName: "builtThicknessBoxSide",
              label: "Built thickness box side",
              routeToSpecMin: "leadEngineer.data.packerElementOd1Min",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            },
            {
              fieldName: "appliedCuringTape",
              label: "Applied curing tape",
              type: "checkbox"
            }
          ]
        }
      ]
    },
    coatingStepLayer: {
      specChapter: ["leadEngineer.vulcanizationSteps", "coatingLayers"],
      queryPath: ["operator.vulcanizationOperators", "coatingOperators", ""],
      pages: [
        {
          pageTitle: "Coating Layer",
          customComponent: "CustomCoating",
          noLine: true
        },
        {
          customComponent: {
            coatedItem: "ActualSteelThickness"
          },
          noLine: true
        },
        {
          showPage: {
            coatedItem: true,
            mould: true
          },
          repeatGroupWithQuerySpecData: true,
          repeatGroupWithQuery: "leadEngineer.rubberCements",
          queryPath: "operator.rubberCementOperators",
          fields: [
            {
              specValueList: [
                "",
                "",
                "leadEngineer.rubberCements",
                "data.rubberCement"
              ],
              label: {
                coatedItem: "Rubber Cement",
                mould: "Rubber Agent"
              }
            },
            {
              page: true,
              queryPath: "mixDates",
              repeatStartWith: 1,
              delete: true,
              addButton: "Add Rubber",
              fields: [
                {
                  fieldName: "mixDate",
                  required: true,
                  indexVariableLabel: true,
                  label: "Mix Date {}",
                  type: "date"
                }
              ]
            }
          ]
        },
        {
          showPage: {
            coatedItem: true,
            mould: true
          },
          fields: [
            {
              specValueList: [
                "leadEngineer.vulcanizationSteps",
                "coatingLayers",
                "data.compoundNumber"
              ],
              label: "Compound Number"
            },
            {
              mathSpec: "mathShrinkThickness",
              label: "order layer thickness"
            },
            {
              specValueList: [
                "leadEngineer.vulcanizationSteps",
                "coatingLayers",
                "data.appliedThickness"
              ],
              label: "rubber thickness to be applied"
            }
          ]
        },
        {
          showPage: {
            coatedItem: true,
            mould: true
          },
          queryPath: [
            "operator.vulcanizationOperators",
            "coatingOperators",
            "layers"
          ],
          repeatStartWith: 1,
          delete: true,
          addButton: "Extra Layer",
          fields: [
            {
              fieldName: "rubberThickness",
              label: "Rubber Thickness",
              type: "Number",
              required: true
            },
            {
              label: "Build Thickness",
              math: "mathMouldThickness"
            },
            {
              fieldName: "mixDate",
              label: "Mix Date",
              type: "date",
              required: true
            }
          ]
        },
        {
          showPage: {
            coatedItem: true
          },

          repeatGroupWithQuerySpecData: true,
          repeatGroupWithQuery: "leadEngineer.data.measurementPoint",
          queryPath: [
            "operator.vulcanizationOperators",
            "coatingOperators",
            "measurementPointOperators"
          ],
          fields: [
            {
              fieldName: "measurementPoint",
              variableLabelSpec: true,
              queryVariableLabel: [
                "",
                "",
                "leadEngineer.measurementPointActualTdvs",
                "data.referencePoint"
              ],
              label: "Measurement Point Reference: {}",
              calculateMin: "mathCumulativeThicknessMin",
              calculateMax: "mathCumulativeThicknessMax",
              type: "number",
              required: true
            }
          ]
        },
        {
          queryPath: [
            "operator.vulcanizationOperators",
            "coatingOperators",
            ""
          ],
          fields: [
            {
              fieldName: "layerApplied",
              label: "Layer Applied",
              type: "datetime-local",
              required: true
            }
          ]
        }
      ]
    },
    vulcanizationStep: {
      pages: [
        {
          pageTitle: "Vulcanization",
          queryPath: ["operator.vulcanizationOperators", ""],
          fields: [
            {
              specValueList: [
                "leadEngineer.vulcanizationSteps",
                "data.vulcanizationOption"
              ],
              label: "Vulcanization Type"
            },
            {
              showField: { coatedItem: true, mould: true },
              specValueList: [
                "leadEngineer.vulcanizationSteps",
                "data.programNumber"
              ],
              label: "Program Number"
            },
            {
              showField: {
                b2P: true,
                dual: true,
                slipon2: true,
                slipon3: true
              },
              mathSpec: "mathProgramNumber",
              label: "Program Number"
            },
            {
              fieldName: "autoclaveNumber",
              required: true,
              label: "Autoclave Number",
              ignoreRequired: { mould: true, coatedItem: true },
              type: "number"
            },
            {
              fieldName: "startTime",
              required: true,
              label: "Start Time",
              type: "datetime-local"
            },
            {
              routeToMin: ["operator.vulcanizationOperators", "data.startTime"],
              fieldName: "stopTime",
              required: true,
              label: "Stop Time",
              type: "datetime-local"
            }
          ]
        }
      ]
    },
    measurementPointStep: {
      pages: [
        {
          pageTitle: "Measurement after Vulcanization",

          repeatGroupWithQuerySpecData: true,
          repeatGroupWithQuery: "leadEngineer.data.measurementPoint",
          queryPath: [
            "operator.vulcanizationOperators",
            "measurementPointOperators"
          ],
          fields: [
            {
              fieldName: "measurementPoint",
              variableLabelSpec: true,
              queryVariableLabel: {
                coatedItem: [
                  "",
                  "leadEngineer.measurementPointActualTdvs",
                  "data.referencePoint"
                ]
              },
              label: {
                coatedItem: "Measurement Point Reference: {}",
                mould: "Measurement Point"
              },
              calculateMin: "mathMeasurementPointMin",
              calculateMax: "mathMeasurementPointMax",
              type: "number",
              required: true,
              notBatch: true,
              unit: "mm",
              decimal: 1
            }
          ]
        }
      ]
    },
    grindingStep: {
      pages: [
        {
          pageTitle: "Grinding between Vulcanization",
          queryPath: ["operator.grindings", ""],
          fields: [...grindingField]
        }
      ]
    },
    ultrasoundAndGrinding: {
      pages: [
        {
          showPage: { b2P: true, slipon2: true, slipon3: true },
          pageTitle: "Ultrasound",
          showIfSpec: "leadEngineer.data.ultrasound",
          queryPath: "operator",
          fields: [...ultrasound.pages[0].fields]
        },
        {
          delete: true,
          writeOnlyFieldIf: "operator.data.deviation",
          showIfSpec: "leadEngineer.data.ultrasound",
          repeatStartWith: 1,
          addButton: "Deviation",
          showPage: { b2P: true, slipon2: true, slipon3: true },
          queryPath: "operator.deviations",
          fields: [...ultrasound.pages[1].fields]
        },
        {
          queryPath: "operator",
          showIfSpec: "leadEngineer.data.ultrasound",
          showPage: { b2P: true, slipon2: true, slipon3: true },
          fields: [...ultrasound.pages[2].fields]
        },
        {
          showPage: { dual: true },
          pageTitle: "Ultrasound Pin Side",
          showIfSpec: "leadEngineer.data.ultrasoundPinSide",
          queryPath: "operator",
          fields: [...addNameToFieldName("PinSide", ultrasound.pages[0].fields)]
        },
        {
          delete: true,
          repeatStartWith: 1,
          showPage: { dual: true },
          writeOnlyFieldIf: "operator.data.deviationPinSide",
          showIfSpec: "leadEngineer.data.ultrasoundPinSide",
          addButton: "Deviation",
          queryPath: "operator.deviations",
          fields: [...addNameToFieldName("PinSide", ultrasound.pages[1].fields)]
        },
        {
          queryPath: "operator",
          showIfSpec: "leadEngineer.data.ultrasoundPinSide",
          showPage: { dual: true },
          fields: [...addNameToFieldName("PinSide", ultrasound.pages[2].fields)]
        },
        {
          pageTitle: "Ultrasound Box Side",
          showPage: { dual: true },
          queryPath: "operator",
          showIfSpec: "leadEngineer.data.ultrasoundBoxSide",
          fields: [...addNameToFieldName("BoxSide", ultrasound.pages[0].fields)]
        },
        {
          delete: true,
          repeatStartWith: 1,
          showPage: { dual: true },
          writeOnlyFieldIf: "operator.data.deviationBoxSide",
          addButton: "Deviation",
          showIfSpec: "leadEngineer.data.ultrasoundBoxSide",
          queryPath: "operator.deviations",
          fields: [...addNameToFieldName("BoxSide", ultrasound.pages[1].fields)]
        },
        {
          queryPath: "operator",
          showIfSpec: "leadEngineer.data.ultrasoundBoxSide",
          showPage: { dual: true },
          fields: [...addNameToFieldName("BoxSide", ultrasound.pages[2].fields)]
        },
        {
          pageTitle: "Grinding",
          queryPath: "operator",
          fields: [...grindingField]
        }
      ]
    },
    completionPhase: {
      pages: [
        {
          showPage: { b2P: true, dual: true },
          pageTitle: "Completion Phase 1",
          queryPath: "operator",
          fields: [
            {
              label: "Screw description",
              mathSpec: "mathScrewDescription"
            },
            {
              fieldName: "removalOfDummyCable",
              required: true,
              label: "Removal of dummy cable",
              type: "checkbox",
              showFieldSpecPath: "leadEngineer.data.cable"
            },
            {
              fieldName: "equipmentIdTorqueWrench",
              required: true,
              label: "Equipment ID(Torque wrench)"
            },
            {
              fieldName: "calibrationDateTorqueWrench",
              required: true,
              label: "Next Calibration date",
              type: "date",
              min: "now"
            },
            {
              mathSpec: "mathTorque",
              label: "Torque",
              unit: "Nm"
            },
            {
              showFieldSpecPath: "leadEngineer.data.K2",
              fieldName: "controlOfK2RingFlaps",
              label: "Control of K2 ring flaps",
              type: "checkbox"
            },
            {
              fieldName: "endRingInstallation",
              required: true,
              label: "Ring installation",
              type: "checkbox"
            }
          ]
        },
        {
          pageTitle: "Barrier",
          showPage: { b2P: true, slipon2: true, slipon3: true },
          showIfSpec: "leadEngineer.data.barrier",
          queryPath: "operator",
          fields: [
            {
              fieldName: "startTimeBarrier",
              label: "Start time",
              type: "datetime-local"
            },
            {
              specValueList: "leadEngineer.data.barrier",
              label: "Barrier type",
              showFieldSpecPath: "leadEngineer.data.barrier"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier1To2]
              },
              mathSpec: "mathIncreasedOdForWholeElement0",
              label: "Tolerance element"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier1To2]
              },
              mathSpec: "mathIncreasedOdForWholeElementTotal0",
              label: "Target thickness element"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier0]
              },
              mathSpec: "mathIncreasedOdForEnds0",
              label: "Tolerance ends"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier0]
              },
              mathSpec: "mathIncreasedOdForEndsTotal0",
              label: "Target thickness ends"
            },
            {
              specValueList: "leadEngineer.data.barrierBoxSide",
              label: "Barrier box side type",
              showFieldSpecPath: "leadEngineer.data.barrierBoxSide"
            },
            {
              fieldName: "equipmentIdBarrier",
              label: "Equipment ID"
            },
            {
              fieldName: "nextCalibrationDateBarrier",
              label: "Next calibration date",
              type: "date",
              min: "now"
            },
            {
              showField: { b2P: true },
              labelOnly: true,
              label: "Before applied"
            },
            {
              showField: { b2P: true },
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier0]
              },
              fieldName: "measurementPointBoxBeforeAppliedBarrier",
              label: "Measurement point box before applied barrier",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            },
            {
              showField: { b2P: true },
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier0]
              },
              fieldName: "measurementPointPinBeforeAppliedBarrier",
              label: "Measurement point pin before applied barrier",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            }
          ]
        },
        {
          showPage: { b2P: true },
          showIfSpec: "leadEngineer.data.barrier",
          queryPath: "operator.measurementPointBeforeBarriers",
          repeatGroupWithQueryMath: "mathMeasurementPoints",
          repeatGroupWithQuerySpecData: true,
          fields: [
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier1To2]
              },
              fieldName: "measurementPointBeforeAppliedBarrier",
              label: "Measurement point {} before applied barrier",
              indexVariableLabel: true,
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier1To2]
              },
              indexVariableLabel: true,
              label: "Target measurement {}",
              unit: "mm",
              decimal: 2,
              math: "mathTargetMeasurement0"
            }
          ]
        },
        {
          showPage: { slipon2: true, slipon3: true },
          showIfSpec: "leadEngineer.data.barrier",
          queryPath: "operator.measurementPointBeforeBarriers",
          repeatGroupWithQueryMath: "mathMeasurementPoints",
          repeatGroupWithQuerySpecData: true,
          fields: [
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier1To2]
              },
              fieldName: "measurementPointBeforeAppliedBarrier",
              label: "Measurement point {} before applied barrier",
              indexVariableLabel: true,
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            }
          ]
        },
        {
          showPage: { b2P: true, slipon2: true, slipon3: true },
          showIfSpec: "leadEngineer.data.barrier",
          fields: [
            {
              labelOnly: true,
              label: "After applied"
            }
          ]
        },
        {
          showPage: { b2P: true },
          showIfSpec: "leadEngineer.data.barrier",
          queryPath: "operator.measurementPointAfterBarriers",
          repeatGroupWithQuerySpecData: true,
          repeatGroupWithQueryMath: "mathMeasurementPoints",
          showPageSpecPath: {
            "leadEngineer.data.barrier": [...barrier1To2]
          },
          fields: [
            {
              indexVariableLabel: true,
              fieldName: "endMeasurement",
              label: "End measurement {}",
              calculateMin: "mathBarrier1Min",
              calculateMax: "mathBarrier1Max",
              required: true,
              type: "number",
              unit: "mm"
            }
          ]
        },
        {
          showPage: { b2P: true },
          showIfSpec: "leadEngineer.data.barrier",
          fields: [
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier0]
              },
              fieldName: "measurementPointBoxAfterAppliedBarrier",
              label: "Measurement point box after applied barrier",
              calculateMin: "mathBarrierBoxSideMin",
              calculateMax: "mathBarrierBoxSideMax",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier0]
              },
              fieldName: "measurementPointPinAfterAppliedBarrier",
              label: "Measurement point pin after applied barrier",
              calculateMin: "mathBarrierPinSideMin",
              calculateMax: "mathBarrierPinSideMax",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            }
          ]
        },
        {
          showIfSpec: "leadEngineer.data.barrier",
          showPage: { slipon2: true, slipon3: true },
          queryPath: "operator.measurementPointAfterBarriers",
          repeatGroupWithQueryMath: "mathMeasurementPoints",
          repeatGroupWithQuerySpecData: true,
          fields: [
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier1To2]
              },
              fieldName: "measurementAfterAppliedBarrier",
              label: "Measurement point {} after applied barrier",
              indexVariableLabel: true,
              required: true,
              calculateMin: "mathBarrier1Min",
              calculateMax: "mathBarrier1Max",
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 2
            }
          ]
        },
        {
          showIfSpec: "leadEngineer.data.barrier",
          showPage: { slipon2: true, slipon3: true },
          queryPath: "operator",
          fields: [
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier0]
              },
              fieldName: "measurementOfEndsBeforeAppliedBarrier",
              label: "Measurement of ends before applied barrier",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [...barrier0]
              },
              fieldName: "measurementOfEndsAfterAppliedBarrier",
              label: "Measurement of ends after applied barrier",
              calculateMin: "mathBarrier0Min",
              calculateMax: "mathBarrier0Max",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            }
          ]
        },
        {
          queryPath: "operator",
          showIfSpec: "leadEngineer.data.barrier",
          showPage: { b2P: true },
          fields: [
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrier": [
                  "0B",
                  "1B",
                  "2B",
                  "3B",
                  "4B",
                  "5B",
                  "6B",
                  "7B",
                  "8B"
                ]
              },
              fieldName: "performedAfterVulcanizationOfBBarrier",
              label: "Performed after vulcanization of B-barrier",
              type: "checkbox"
            }
          ]
        },
        {
          queryPath: "operator",
          showPage: { b2P: true, slipon2: true, slipon3: true },
          showIfSpec: "leadEngineer.data.barrier",
          fields: [
            {
              fieldName: "barrierFinished",
              label: "Barrier finished",
              required: true,
              type: "datetime-local"
            }
          ]
        },
        {
          showPage: { dual: true },
          showIfSpec: "leadEngineer.data.barrierPinSide",
          pageTitle: "Barrier Pin side",
          queryPath: "operator",
          fields: [
            {
              fieldName: "startTimeBarrierPinSide",
              label: "Start time",
              type: "datetime-local"
            },
            {
              specValueList: "leadEngineer.data.barrierPinSide",
              label: "barrier pin side type",
              showFieldSpecPath: "leadEngineer.data.barrierPinSide"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierPinSide": [...barrier1To2]
              },
              mathSpec: "mathIncreasedOdForWholeElement1",
              label: "Tolerance element pin side"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierPinSide": [...barrier1To2]
              },
              mathSpec: "mathIncreasedOdForWholeElementTotal1",
              label: "Target thickness element pin side"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierPinSide": [...barrier0]
              },
              mathSpec: "mathIncreasedOdForEnds1",
              label: "Tolerance ends pin side"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierPinSide": [...barrier0]
              },
              mathSpec: "mathIncreasedOdForEndsTotal1",
              label: "Target thickness ends pin side"
            },
            {
              fieldName: "equipmentIdBarrierPinSide",
              label: "Equipment ID"
            },
            {
              fieldName: "nextCalibrationDateBarrierPinSide",
              label: "Next calibration date",
              type: "date",
              min: "now"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierPinSide": [...barrier0]
              },
              labelOnly: true,
              label: "Before applied"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierPinSide": [...barrier0]
              },
              fieldName: "measurementPointBoxBeforeAppliedBarrierPinSide",
              label: "Measurement point box before applied barrier",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierPinSide": [...barrier0]
              },
              fieldName: "measurementPointPinBeforeAppliedBarrierPinSide",
              label: "Measurement point pin before applied barrier",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            }
          ]
        },
        {
          showPage: { dual: true },
          showIfSpec: "leadEngineer.data.barrierPinSide",
          queryPath: "operator.measurementPointBeforeBarrierPinSides",
          repeatGroupWithQueryMath: "mathMeasurementPointsPinSide",
          repeatGroupWithQuerySpecData: true,
          fields: [
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierPinSide": [...barrier1To2]
              },
              fieldName: "measurementPointBeforeAppliedBarrierPinSide",
              label: "Measurement point {} before applied barrier",
              indexVariableLabel: true,
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierPinSide": [...barrier1To2]
              },
              indexVariableLabel: true,
              label: "Target measurement {}",
              math: "mathTargetMeasurementPinSide",
              decimal: 2
            }
          ]
        },
        {
          showPage: { dual: true },
          showIfSpec: "leadEngineer.data.barrierPinSide",
          queryPath: "operator",
          fields: [
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierPinSide": [...barrier0]
              },
              labelOnly: true,
              label: "After applied"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierPinSide": [...barrier0]
              },
              fieldName: "measurementPointBoxAfterBarrierPinSide",
              label: "Measurement point box after applied barrier",
              required: true,
              calculateMin: "mathBarrierBoxSidePinSideMin",
              calculateMax: "mathBarrierBoxSidePinSideMax",
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierPinSide": [...barrier0]
              },
              fieldName: "measurementPointPinAfterBarrierPinSide",
              label: "Measurement point pin after applied barrier",
              calculateMin: "mathBarrierPinSidePinSideMin",
              calculateMax: "mathBarrierPinSidePinSideMax",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            }
          ]
        },
        {
          showPage: { dual: true },
          showIfSpec: "leadEngineer.data.barrierPinSide",
          queryPath: "operator.measurementPointAfterBarrierPinSides",
          repeatGroupWithQueryMath: "mathMeasurementPointsPinSide",
          repeatGroupWithQuerySpecData: true,
          showPageSpecPath: {
            "leadEngineer.data.barrierPinSide": [...barrier1To2]
          },
          fields: [
            {
              indexVariableLabel: true,
              fieldName: "endMeasurementPinSide",
              label: "End measurement {}",
              calculateMin: "mathBarrier1PinSideMin",
              calculateMax: "mathBarrier1PinSideMax",
              required: true,
              type: "number"
            }
          ]
        },
        {
          queryPath: "operator",
          showPage: { dual: true },
          showIfSpec: "leadEngineer.data.barrierPinSide",
          fields: [
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierPinSide": [
                  "0B",
                  "1B",
                  "2B",
                  "3B",
                  "4B",
                  "5B",
                  "6B",
                  "7B",
                  "8B"
                ]
              },
              fieldName: "performedAfterVulcanizationOfBBarrierPinSide",
              label: "Performed after vulcanization of B-barrier",
              required: true,
              type: "checkbox"
            },
            {
              fieldName: "barrierFinishedPinSide",
              label: "Barrier finished",
              required: true,
              type: "datetime-local"
            }
          ]
        },
        {
          showPage: { dual: true },
          showIfSpec: "leadEngineer.data.barrierBoxSide",
          pageTitle: "Barrier Box side",
          queryPath: "operator",
          fields: [
            {
              fieldName: "startTimeBarrierBoxSide",
              label: "Start time",
              type: "datetime-local"
            },
            {
              specValueList: "leadEngineer.data.barrierBoxSide",
              label: "Barrier box side type",
              showFieldSpecPath: "leadEngineer.data.barrierBoxSide"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierBoxSide": [...barrier1To2]
              },
              mathSpec: "mathIncreasedOdForWholeElement2",
              label: "Tolerance element box side"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierBoxSide": [...barrier1To2]
              },
              mathSpec: "mathIncreasedOdForWholeElementTotal2",
              label: "Target thickness element box side"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierBoxSide": [...barrier0]
              },
              mathSpec: "mathIncreasedOdForEnds2",
              label: "Tolerance ends box side"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierBoxSide": [...barrier0]
              },
              mathSpec: "mathIncreasedOdForEndsTotal2",
              label: "Target thickness ends box side"
            },
            {
              fieldName: "equipmentIdBarrierBoxSide",
              label: "Equipment ID"
            },
            {
              fieldName: "nextCalibrationDateBarrierBoxSide",
              label: "Next calibration date",
              type: "date",
              min: "now"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierBoxSide": [...barrier0]
              },
              labelOnly: true,
              label: "Before applied"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierBoxSide": [...barrier0]
              },
              fieldName: "measurementPointBoxBeforeAppliedBarrierBoxSide",
              label: "Measurement point box before applied barrier",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierBoxSide": [...barrier0]
              },
              fieldName: "measurementPointPinBeforeAppliedBarrierBoxSide",
              label: "Measurement point pin before applied barrier",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            }
          ]
        },
        {
          showPage: { dual: true },
          showIfSpec: "leadEngineer.data.barrierBoxSide",
          queryPath: "operator.measurementPointBeforeBarrierBoxSides",
          repeatGroupWithQueryMath: "mathMeasurementPointsBoxSide",
          repeatGroupWithQuerySpecData: true,
          fields: [
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierBoxSide": [...barrier1To2]
              },
              fieldName: "measurementPointBeforeAppliedBarrierBoxSide",
              label: "Measurement point {} before applied barrier",
              indexVariableLabel: true,
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierBoxSide": [...barrier1To2]
              },
              indexVariableLabel: true,
              label: "Target measurement {}",
              math: "mathTargetMeasurementBoxSide",
              decimal: 2
            }
          ]
        },
        {
          showPage: { dual: true },
          showIfSpec: "leadEngineer.data.barrierBoxSide",
          fields: [
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierBoxSide": [...barrier0]
              },
              labelOnly: true,
              label: "After applied"
            }
          ]
        },
        {
          showPage: { dual: true },
          showIfSpec: "leadEngineer.data.barrierBoxSide",
          showPageSpecPath: {
            "leadEngineer.data.barrierBoxSide": [...barrier1To2]
          },
          queryPath: "operator.measurementPointAfterBarrierBoxSides",
          repeatGroupWithQuerySpecData: true,
          repeatGroupWithQueryMath: "mathMeasurementPointsBoxSide",
          fields: [
            {
              indexVariableLabel: true,
              fieldName: "endMeasurementBoxSide",
              label: "End measurement {}",
              calculateMin: "mathBarrier1BoxSideMin",
              calculateMax: "mathBarrier1BoxSideMax",
              required: true,
              type: "number"
            }
          ]
        },
        {
          showPage: { dual: true },
          showIfSpec: "leadEngineer.data.barrierBoxSide",
          queryPath: "operator",
          fields: [
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierBoxSide": [...barrier0]
              },
              fieldName: "measurementPointBoxAfterBarrierBoxSide",
              label: "Measurement point box after applied barrier",
              required: true,
              calculateMin: "mathBarrierBoxSideBoxSideMin",
              calculateMax: "mathBarrierBoxSideBoxSideMax",
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierBoxSide": [...barrier0]
              },
              fieldName: "measurementPointPinAfterBarrierBoxSide",
              label: "Measurement point pin after applied barrier",
              calculateMin: "mathBarrierPinSideBoxSideMin",
              calculateMax: "mathBarrierPinSideBoxSideMax",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            }
          ]
        },
        {
          showPage: { dual: true },
          showIfSpec: "leadEngineer.data.barrierBoxSide",
          queryPath: "operator",
          fields: [
            {
              showFieldSpecPath: {
                "leadEngineer.data.barrierBoxSide": [
                  "0B",
                  "1B",
                  "2B",
                  "3B",
                  "4B",
                  "5B",
                  "6B",
                  "7B",
                  "8B"
                ]
              },
              fieldName: "performedAfterVulcanizationOfBBarrierBoxSide",
              label: "Performed after vulcanization of B-barrier",
              required: true,
              type: "checkbox"
            },
            {
              fieldName: "barrierFinishedBoxSide",
              label: "Barrier finished",
              required: true,
              type: "datetime-local"
            }
          ]
        },
        {
          pageTitle: "Completion Phase 2",
          queryPath: "operator",
          fields: [
            {
              showField: { slipon2: true, slipon3: true },
              fieldName: "drillingHasBeenCompleted",
              label: "Drilling has been completed",
              required: true,
              type: "checkbox"
            },
            {
              showField: { b2P: true, dual: true },
              fieldName: "internalCleaning",
              label: "Internal cleaning",
              type: "checkbox",
              required: true
            },
            {
              showField: { b2P: true, dual: true },
              label: "Cleaning of thread",
              fieldName: "cleaningOfThread",
              type: "checkbox",
              required: true
            },
            {
              specValueList: "leadEngineer.data.idDriftSize",
              label: "Drift size"
            },
            {
              fieldName: "calibrationDate",
              required: true,
              label: "Next Calibration date",
              type: "date",
              min: "now"
            },
            {
              fieldName: "equipmentIdCompletionPhase",
              required: true,
              label: "Equipment ID"
            },
            {
              fieldName: "identificationMarkingDone",
              required: true,
              label: "Identification Marking Done",
              type: "date"
            },
            {
              label: "Identification Marking",
              math: "mathIdentificationMarkingOperator"
            },
            {
              fieldName: "marking",
              required: true,
              label: "Marking",
              type: "checkbox"
            }
          ]
        },
        {
          showPage: { b2P: true, dual: true },
          queryPath: "operator.measurementPointCompletionPhases",
          repeatGroupWithQueryMath: "mathMeasurementPoints",
          repeatGroupWithQuerySpecData: true,
          fields: [
            {
              fieldName: "odMeasurementPoint",
              label: "OD Measurement Point {}",
              indexVariableLabel: true,
              calculateMin: "mathOdMeasurementPointMin",
              calculateMax: "mathOdMeasurementPointMax",
              required: true,
              type: "number",
              notBatch: true,
              unit: "mm",
              decimal: 1
            }
          ]
        }
      ]
    },
    touchUp: {
      pages: [
        {
          pageTitle: "Touch-Up",
          queryPath: "operator",
          fields: [
            {
              fieldName: "touchUp",
              required: true,
              label: "Touch-Up",
              type: "checkbox",
              subtext: "Check if touch-up is performed"
            },
            {
              fieldName: "touchUpPerformed",
              required: true,
              label: "Touch Up Performed",
              type: "datetime-local"
            }
          ]
        }
      ]
    },
    touchUpPacker: {
      pages: [
        {
          pageTitle: "Touch-Up",
          queryPath: "operator",
          fields: [
            {
              showField: {
                b2P: true,
                dual: true
              },
              fieldName: "appliedThreadDop",
              required: true,
              label: "Applied thread dop",
              type: "select",
              options: ["Mercasol", "Kendex orange"]
            },
            {
              showField: {
                b2P: true,
                dual: true
              },
              fieldName: "bioDopStorageOil",
              label: "Bio Dop Storage oil",
              type: "checkbox"
            },
            {
              label: "Packed specification",
              mathSpec: "mathPackingSpecification"
            },
            {
              fieldName: "packedInAccordantToSpec",
              label: "Packed in accordant to spec",
              required: true,
              type: "checkbox"
            },
            {
              showField: {
                slipon2: true,
                slipon3: true
              },
              fieldName: "affixedLabel",
              label: "Affixed label",
              required: true,
              type: "checkbox"
            }
          ]
        }
      ]
    }
  }
};
