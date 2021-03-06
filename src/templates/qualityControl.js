export default {
  getNewValue: "finalInspectionQualityControl.new.item",
  getOldValue: "items",
  mutation: "QUALITY_CONTROL",
  chapterByStage: true,
  query: "QUALITY_CONTROL",
  chapters: {
    qualityControlCoatedItem: {
      queryPath: "finalInspectionQualityControl",
      pages: [
        {
          pageTitle: "Final Inspection",
          repeatGroupWithQuerySpecData: true,
          repeatGroupWithQuery: "leadEngineer.data.measurementPoint",
          queryPath:
            "finalInspectionQualityControl.measurementPointQualityControls",
          fields: [
            {
              fieldName: "measurementPoint",
              queryVariableLabel: {
                coatedItem: [
                  "leadEngineer.measurementPointActualTdvs",
                  "data.referencePoint"
                ]
              },
              indexVariableLabel: { mould: true },
              variableLabelSpec: true,
              label: {
                coatedItem: "Measurement Point Reference: {}",
                mould: "Measurement Point {}"
              },
              calculateMin: {
                coatedItem: "mathQualityControlMeasurementPointCoatingItemMin",
                mould: "mathQualityControlMeasurementPointMouldMin"
              },
              calculateMax: {
                coatedItem: "mathQualityControlMeasurementPointCoatingItemMax",
                mould: "mathQualityControlMeasurementPointMouldMax"
              },
              ignoreMin: true,
              ignoreMax: true,
              type: "number",
              required: true,
              unit: "mm"
            }
          ]
        },
        {
          queryPath: "finalInspectionQualityControl",
          fields: [
            {
              showField: {
                mould: true
              },
              fieldName: "totalCoatingThickness",
              label: "Total Coating Thickness",
              type: "checkbox",
              required: true,
              subtext: "See ITP.",
              showFieldSpecPath: "leadEngineer.data.totalCoatingThickness"
            },
            {
              fieldName: "visualInspection",
              label: "Visual Inspection",
              type: "checkbox",
              subtext: {
                slipon3: "See EW-I-1.",
                slipon2: "See EW-I-1.",
                b2P: "See EW-I-1.",
                dual: "See EW-I-1.",
                coatedItem: "See ITP.",
                mould: "See ITP."
              },
              required: true,
              showFieldSpecPath: "leadEngineer.data.visualInspection"
            },
            {
              fieldName: "simpleFinalDimensionsCheck",
              label: "Simple Final Dimensions Check",
              subtext: "See ITP.",
              type: "checkbox",
              required: true,
              showFieldSpecPath: "leadEngineer.data.simpleFinalDimensionsCheck"
            },
            {
              fieldName: "sparkTest",
              label: "Spark Test",
              subtext: "See ITP.",
              type: "checkbox",
              required: true,
              showFieldSpecPath: "leadEngineer.data.sparkTest"
            },
            {
              fieldName: "hammerTest",
              label: "Hammer Test",
              type: "checkbox",
              subtext: "See ITP.",
              required: true,
              showFieldSpecPath: "leadEngineer.data.hammerTest"
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "identificationMarking",
              label: "Identification Marking",
              subtext: "Item ID matches (see overview)",
              showFieldSpecPath: "leadEngineer.data.identificationMarking",
              required: true,
              type: "checkbox"
            }
          ]
        },
        {
          queryPath: "finalInspectionQualityControl.hardnessQualityControls",
          repeatGroupWithQuerySpecData: true,
          repeatGroupWithQuery:
            "leadEngineer.data.numberOfHardnessOfOuterLayer",
          fields: [
            {
              fieldName: "hardnessOfOuterLayer",
              indexVariableLabel: true,
              required: true,
              label: "Hardness Of Outer Layer: {}",
              unit: "Shore A",
              type: "number"
            }
          ]
        },
        {
          queryPath: "finalInspectionQualityControl.peelTestQualityControls",
          repeatGroupWithQuerySpecData: true,
          repeatGroupWithQuery: "leadEngineer.data.numberOfPeelTest",
          fields: [
            {
              fieldName: "peelTest",
              indexVariableLabel: true,
              required: true,
              unit: "kg/25mm",
              label: "Peel Test: {}",
              type: "number"
            },
            {
              fieldName: "peelTestConversion",
              label: "Tolerated Minimum",
              unit: "N/25mm",
              math: "mathPeelTest",
              type: "number"
            }
          ]
        },
        {
          repeatGroupWithQuerySpecData: true,
          repeatGroupWithQuery: "leadEngineer.finalInspectionDimensionsChecks",
          queryPath:
            "finalInspectionQualityControl.finalInspectionDimensionsCheckQualityControls",
          fields: [
            {
              fieldName: "finalInspectionDimensionsChecks",
              variableLabelSpec: true,
              queryVariableLabel: [
                "leadEngineer.finalInspectionDimensionsChecks",
                "data.finalDimensionsReference"
              ],
              label: "Final Dimensions Reference {}",
              routeToSpecMin: [
                "leadEngineer.finalInspectionDimensionsChecks",
                "data.finalDimensionsMin"
              ],
              routeToSpecMax: [
                "leadEngineer.finalInspectionDimensionsChecks",
                "data.finalDimensionsMax"
              ]
            }
          ]
        },
        {
          repeatGroupWithQuerySpecData: true,
          repeatGroupWithQuery: "leadEngineer.finalInspectionCustomTests",
          queryPath:
            "finalInspectionQualityControl.finalInspectionCustomTestQualityControls",
          fields: [
            {
              specValueList: [
                "leadEngineer.finalInspectionCustomTests",
                "data.name"
              ],
              label: "Custom Test Name"
            },
            {
              specValueList: [
                "leadEngineer.finalInspectionCustomTests",
                "data.criteria"
              ],
              label: "Custom Test Criteria"
            },
            {
              fieldName: "test",
              label: "Test"
            }
          ]
        },
        {
          label: "File Upload",
          type: "files",
          queryPath: "finalInspectionQualityControl.uploadFiles",
          description: true
        },
        {
          queryPath: "finalInspectionQualityControl",
          fields: [
            {
              showField: {
                mould: true,
                coatedItem: true
              },
              fieldName: "finalInspectionComment",
              label: "Final Inspection Comment",
              type: "comment"
            }
          ]
        }
      ]
    },
    finalInspectionAsBuilt: {
      queryPath: "finalInspectionQualityControl",
      pages: [
        {
          pageTitle: "Final Inspection",
          queryPath: "finalInspectionQualityControl",
          fields: [
            {
              math: "mathIdentificationMarkingQualityControl",
              label: "Identification Marking"
            },
            {
              fieldName: "identificationMarking",
              label: "Identification Marking",
              subtext: "ID matches 123.",
              required: true,
              type: "checkbox"
            },
            {
              showFieldSpecPath: "leadEngineer.data.asBuilt",
              fieldName: "totalLength",
              label: "Total length",
              specVariableSubtext: "leadEngineer.data.totalLength",
              subtext: "Dwg Ref. L1, Total length {}"
            },
            {
              showFieldSpecPath: "leadEngineer.data.asBuilt",
              fieldName: "totalLengthPinMakeUpLoss",
              label: "Total length - Pin make up loss",
              specVariableSubtext: "leadEngineer.data.totalLengthPinMakeUpLoss",
              subtext:
                "Dwg Ref. L1 - Thread, Total length - Pin make up loss {}"
            },
            {
              showFieldSpecPath: "leadEngineer.data.asBuilt",
              fieldName: "handlingSpacePinEnd",
              label: "Handling space pin end",
              calculateMin: "mathHandlingSpacePinEndMin",
              calculateMax: "mathHandlingSpacePinEndMax",
              type: "number",
              unit: "mm",
              subtext: "Dwg Ref. L2"
            },
            {
              showFieldSpecPath: "leadEngineer.data.asBuilt",
              fieldName: "handlingSpaceBoxEnd",
              label: "Handling space box end",
              calculateMin: "mathHandlingSpaceBoxEndMin",
              calculateMax: "mathHandlingSpaceBoxEndMax",
              type: "number",
              unit: "mm",
              subtext: "Dwg Ref. L3, Handling space box end {}"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard"
                ]
              },
              fieldName: "packerElementLength",
              label: "Packer element length",
              subtext: "Dwg Ref. L4",
              calculateMin: "mathPackerElementLengthMin",
              calculateMax: "mathPackerElementLengthMax",
              type: "number",
              unit: "mm"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 2 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 with 2 center ringer"
                ]
              },
              fieldName: "packerElementLengthTotal",
              label: "Packer element length total",
              subtext: "Dwg Ref. L4",
              calculateMin: "mathPackerElementLengthTotalMin",
              calculateMax: "mathPackerElementLengthTotalMax",
              type: "number",
              unit: "mm"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring"
                ]
              },
              fieldName: "packerElementLength1",
              label: "Packer element length #1",
              subtext: "Dwg Ref. L4.1",
              calculateMin: "mathPackerElementLength1Min",
              calculateMax: "mathPackerElementLength1Max",
              type: "number",
              unit: "mm"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring"
                ]
              },
              fieldName: "packerElementLength2",
              calculateMin: "mathPackerElementLength2Min",
              calculateMax: "mathPackerElementLength2Max",
              type: "number",
              unit: "mm",
              label: "Packer element length #2",
              subtext: "Dwg Ref. L4.2"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 2 center ring",
                  "Swell packer K2 with 2 center ringer"
                ]
              },
              fieldName: "packerElementLength3",
              calculateMin: "mathPackerElementLength3Min",
              calculateMax: "mathPackerElementLength3Max",
              type: "number",
              unit: "mm",
              label: "Packer element length #3",
              subtext: "Dwg Ref. L4.3"
            },
            {
              showFieldSpecPath: "leadEngineer.data.asBuilt",
              fieldName: "basePipeOd",
              specVariableSubtext: "leadEngineer.data.basePipeOd",
              label: "Base pipe OD",
              subtext: "Dwg Ref. D1, Base pipe OD {}"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring",
                  "Swell packer standard",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard"
                ]
              },
              calculateMin: "mathPackerElementOd1Min",
              calculateMax: "mathPackerElementOd1Max",
              type: "number",
              unit: "mm",
              fieldName: "packerElementOd1",
              label: "Packer element OD #1",
              subtext: "Dwg Ref. D2"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "packerElementOd2",
              calculateMin: "mathPackerElementOd2Min",
              calculateMax: "mathPackerElementOd2Max",
              type: "number",
              unit: "mm",
              label: "Packer element OD #2",
              subtext: "Dwg Ref. D3"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "packerElementOd3",
              calculateMin: "mathPackerElementOd3Min",
              calculateMax: "mathPackerElementOd3Max",
              type: "number",
              unit: "mm",
              label: "Packer element OD #3",
              subtext: "Dwg Ref. D4"
            },
            {
              showFieldSpecPath: "leadEngineer.data.asBuilt",
              calculateMin: "mathEndRingOdMin",
              calculateMax: "mathEndRingOdMax",
              fieldName: "endRingOd",
              type: "number",
              unit: "mm",
              label: "End-ring OD",
              subtext: "Dwg Ref. D2"
            },
            {
              showFieldSpecPath: "leadEngineer.data.asBuilt",
              calculateMin: "mathEndRingLengthMin",
              calculateMax: "mathEndRingLengthMax",
              label: "End-ring Length",
              fieldName: "endRingLength",
              type: "number",
              unit: "mm"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "centerRingOd",
              calculateMin: "mathCenterRingOdMin",
              calculateMax: "mathCenterRingOdMax",
              type: "number",
              unit: "mm",
              label: "Center-ring OD",
              subtext: "Dwg Ref. D3"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "centerRingLength",
              calculateMin: "mathCenterRingLengthMin",
              calculateMax: "mathCenterRingLengthMax",
              type: "number",
              unit: "mm",
              label: "Center-ring Length"
            },
            {
              showFieldSpecPath: "leadEngineer.data.asBuilt",
              fieldName: "couplingLength",
              specVariableSubtext: "leadEngineer.data.couplingLength",
              label: "Coupling length",
              subtext: "Coupling length"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "controlLine1",
              specVariableSubtext: "leadEngineer.data.controlLine1",
              label: "Control line #1",
              subtext: "Dwg Ref. CL1, control line #1 {}"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "controlLine2",
              specVariableSubtext: "leadEngineer.data.controlLine2",
              label: "Control line #2",
              subtext: "Dwg Ref. CL2, control line #2 {}"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "controlLine3",
              specVariableSubtext: "leadEngineer.data.controlLine3",
              label: "Control line #3",
              subtext: "Dwg Ref. CL3, control line #3 {}"
            },
            {
              showFieldSpecPath: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "controlLine4",
              specVariableSubtext: "leadEngineer.data.controlLine4",
              label: "control line #4",
              subtext: "Dwg Ref. CL4, control line #4 {}"
            },
            {
              showFieldSpecPath: "leadEngineer.data.asBuilt",
              fieldName: "custom",
              specVariableSubtext: "leadEngineer.data.custom",
              label: "Custom (Others)",
              subtext: "{}"
            },

            {
              showField: { slipon2: true, slipon3: true },
              fieldName: "elementLength",
              specVariableSubtext: "leadEngineer.data.elementLength",
              label: "Element length",
              subtext: "Element length {}"
            },
            {
              showField: { slipon2: true, slipon3: true },
              fieldName: "elementOd",
              specVariableSubtext: "leadEngineer.data.elementOd",
              label: "Element OD",
              subtext: "Element OD {}"
            }
          ]
        }
      ]
    },
    finalInspectionPacker: {
      queryPath: "finalInspectionQualityControl",
      pages: [
        {
          queryPath: "finalInspectionQualityControl",
          fields: [
            {
              label: "Core sample",
              mathSpec: "mathCoreSampleCode"
            },
            {
              fieldName: "coreSampleApproved",
              required: true,
              label: "Core sample approved",
              type: "checkbox"
            }
          ]
        }
      ]
    }
  }
};
