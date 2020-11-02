const barrierOptions = [
  "0A",
  "1A",
  "2A",
  "3A",
  "4A",
  "5A",
  "6A",
  "7A",
  "8A",
  "0B",
  "1B",
  "2B",
  "3B",
  "4B",
  "5B",
  "6B",
  "7B",
  "8B",
  "0C",
  "1C",
  "2C",
  "3C",
  "4C",
  "5C",
  "6C",
  "7C",
  "8C"
];

export default {
  getNewValue: "leadEngineer.new",
  getOldValue: "items.0.leadEngineer",
  mutation: "LEAD_ENGINEER",
  query: "GET_LEAD_ENGINEER",
  chapters: [
    {
      stageQueryPath: "leadEngineer.data.steelPreparation",
      pages: [
        {
          pageTitle: "Steel Preparation",
          queryPath: "leadEngineer",
          fields: [
            {
              fieldName: "mediaBlasting",
              label: "Media Blasting",
              type: "checkbox",
              default: true
            },
            {
              fieldName: "steel",
              label: "Steel",
              type: "select",
              options: ["Carbon", "Carbon - Q125", "Duplex", "Chrome"],
              writeOnlyFieldIf: "leadEngineer.data.mediaBlasting"
            },
            {
              fieldName: "blastMedia",
              label: "Blast Media",
              type: "select",
              options: [
                "Garnet",
                "Grit",
                "Aluminum Oxide",
                "Rubbing",
                "Chrome"
              ],
              writeOnlyFieldIf: "leadEngineer.data.mediaBlasting"
            },
            {
              fieldName: "relativeHumidity",
              label: "Relative Humidity",
              default: 85,
              type: "Number",
              prepend: "Max",
              unit: "%",
              subtext: "ISO 8502-4",
              writeOnlyFieldIf: "leadEngineer.data.mediaBlasting"
            },
            {
              fieldName: "airTemperature",
              label: "Air Temperature",
              default: 15,
              unit: "°C",
              prepend: "Min",
              type: "Number",
              subtext: "ISO 8502-4",
              writeOnlyFieldIf: "leadEngineer.data.mediaBlasting"
            },
            {
              fieldName: "steelTemperature",
              label: "Steel Temperature",
              default: 15,
              unit: "°C",
              prepend: "Min",
              type: "Number",
              subtext: {
                coatedItem: "ISO 8502-4",
                mould: "ISO 8502-4",
                slipon2: "SO 8502-4",
                slipon3: "SO 8502-4",
                b2P: "SO 8502-4",
                dual: "SO 8502-4"
              },
              writeOnlyFieldIf: "leadEngineer.data.mediaBlasting"
            },
            {
              fieldName: "dewPoint",
              label: "Dew Point",
              default: 12,
              unit: "°C",
              prepend: "Min",
              type: "Number",
              subtext: "ISO 8502-4, Dew Point Temperature",
              writeOnlyFieldIf: "leadEngineer.data.mediaBlasting"
            },
            {
              fieldName: "temperatureOverDewPoint",
              label: "Temperature over Dew Point",
              default: 3,
              unit: "°C",
              prepend: "Min",
              type: "Number",
              subtext:
                "ISO 8502-4, Difference between Steel Temperature and Dew Point Temperature",
              writeOnlyFieldIf: "leadEngineer.data.mediaBlasting"
            },
            {
              fieldName: "additionalTests",
              label: "Additional Tests",
              type: "checkbox",
              default: {
                coatedItem: true,
                mould: false,
                slipon2: true,
                slipon3: true,
                b2P: true,
                dual: true
              }
            },
            {
              fieldName: "blastMediaConductivity",
              label: "Blast Media Conductivity",
              type: "Number",
              prepend: "Max",
              unit: "µS/cm",
              subtext: "ISO 8502-9",
              writeOnlyFieldIf: "leadEngineer.data.additionalTests",
              showField: {
                coatedItem: true,
                mould: true
              }
            },
            {
              fieldName: "surfaceProfileMin",
              label: "Surface Profile (Roughness) Min",
              prepend: "Min",
              unit: {
                coatedItem: "Rz",
                mould: "Rz",
                slipon2: "Ra",
                slipon3: "Ra",
                b2P: "Ra",
                dual: "Ra"
              },
              default: {
                coatedItem: 50,
                mould: 50,
                slipon2: 3,
                slipon3: 3,
                b2P: 5,
                dual: 5
              },
              type: "Number",
              subtext: "ISO 8503-4",
              writeOnlyFieldIf: "leadEngineer.data.additionalTests"
            },
            {
              fieldName: "surfaceProfileMax",
              label: "Surface Profile (Roughness) Max",
              prepend: "Max",
              unit: {
                coatedItem: "Rz",
                mould: "Rz",
                slipon2: "Ra",
                slipon3: "Ra",
                b2P: "Ra",
                dual: "Ra"
              },
              default: {
                coatedItem: 100,
                mould: 100,
                slipon2: 15,
                slipon3: 15,
                b2P: 15,
                dual: 15
              },
              type: "Number",
              subtext: "ISO 8503-4",
              writeOnlyFieldIf: "leadEngineer.data.additionalTests"
            },
            {
              fieldName: "solubleSaltLevel",
              label: "Soluble Salt Level",
              default: 20,
              type: "Number",
              prepend: "Max",
              unit: "mg/m²",
              subtext: "ISO 8502-5/9",
              writeOnlyFieldIf: "leadEngineer.data.additionalTests",
              showField: {
                coatedItem: true,
                mould: true
              }
            },
            {
              fieldName: "dustTest",
              label: "Dust Test",
              type: "Number",
              prepend: "Max",
              min: 1,
              max: 5,
              subtext: "ISO 8502-3, Whole number between 1-5",
              writeOnlyFieldIf: "leadEngineer.data.additionalTests",
              showField: {
                coatedItem: true,
                mould: true
              }
            },
            {
              fieldName: "inspectionOfSteelSurface",
              label: "Inspection of Steel Surface",
              type: "checkbox",
              subtext: "ISO 8501-3, Welds to be grade P3",
              writeOnlyFieldIf: "leadEngineer.data.additionalTests",
              showField: {
                coatedItem: true,
                mould: true
              }
            },
            {
              fieldName: "compressedAirCheck",
              label: "Compressed Air Check",
              placeholder: "Min",
              type: "checkbox",
              subtext: "ASTM D 4285, No oil and no water",
              writeOnlyFieldIf: "leadEngineer.data.additionalTests",
              showField: {
                coatedItem: true,
                mould: true
              }
            },
            {
              fieldName: "surfaceCleanliness",
              label: "Surface Cleanliness",
              placeholder: "Max",
              type: "checkbox",
              subtext: "ISO 8501-1, Min. Sa 2,5 (Rust grade A or B)",
              writeOnlyFieldIf: "leadEngineer.data.additionalTests",
              showField: {
                coatedItem: true,
                mould: true
              }
            },
            {
              fieldName: "uvTest",
              label: "UV Test",
              type: "checkbox",
              subtext: "No reflecting light",
              writeOnlyFieldIf: "leadEngineer.data.additionalTests",
              showField: {
                coatedItem: true,
                mould: true
              }
            }
          ]
        },
        {
          queryPath: "leadEngineer.additionalCustomTests",
          delete: true,
          writeOnlyFieldIf: "leadEngineer.data.additionalTests",
          addButton: "Custom Test",
          fields: [
            {
              fieldName: "name",
              prepend: "Name",
              label: "Custom Test"
            },
            {
              fieldName: "criteria",
              prepend: "Criteria"
            }
          ]
        },
        {
          queryPath: "leadEngineer",
          fields: [
            {
              fieldName: "primer1",
              label: "Primer 1",
              type: "select",
              default: {
                slipon2: "Chemosil 360",
                slipon3: "Chemosil 360",
                b2P: "Chemosil 360",
                dual: "Chemosil 360"
              },
              options: [
                "Chemosil 211",
                "Chemosil 231",
                "Chemosil 360",
                "Chemosil 411"
              ]
            },
            {
              fieldName: "primer2",
              label: "Primer 2",
              type: "select",
              default: {
                slipon2: "Chemosil 411",
                slipon3: "Chemosil 411",
                b2P: "Chemosil 411",
                dual: "Chemosil 411"
              },
              options: [
                "Chemosil 211",
                "Chemosil 231",
                "Chemosil 360",
                "Chemosil 411"
              ]
            },
            {
              showField: {
                coatedItem: true,
                mould: true
              },
              fieldName: "itemRubberCementsBeforeCoating",
              label: "Item Rubber Cement Before Coating",
              type: "select",
              options: ["75051", "Soap"]
            },
            {
              showField: {
                coatedItem: true,
                mould: true
              },
              fieldName: "releaseCementsBeforeCoating",
              label: "Release Agent Before Coating",
              type: "select",
              options: ["75051", "Soap"]
            }
          ]
        }
      ]
    },
    {
      showChapter: { coatedItem: true, mould: true },
      stageQueryPath: "leadEngineer.data.coatingVulcanization",
      pages: [
        {
          pageTitle: "Coating and Vulcanization",
          query: "GET_LEAD_ENGINEER",
          queryPath: "leadEngineer",
          mutation: "LEAD_ENGINEER",
          fields: [
            {
              fieldName: "measurementPoint",
              label: "Measurement Points",
              type: "Number",
              subtext: "Pre-Coating",
              required: true,
              minInput: 0,
              maxInput: 10,
              notSingleEdit: true
            },
            {
              showField: {
                coatedItem: true
              },
              fieldName: "targetDescriptionValue",
              label: "TDV (Target Description Value)",
              type: "select",
              required: true,
              notSingleEdit: true,
              options: ["OD", "ID"]
            }
          ]
        },
        {
          showPage: {
            coatedItem: true
          },
          queryPath: "leadEngineer.measurementPointActualTdvs",

          repeatGroupWithQuery: "leadEngineer.data.measurementPoint",
          fields: [
            {
              fieldName: "measurementPointActual",
              queryVariableLabel: "leadEngineer.data.targetDescriptionValue",
              label: "Measurement Point Actual Steel {}",
              required: true,
              type: "number",
              unit: "mm",
              decimal: 1
            },
            {
              fieldName: "referencePoint",
              label: "Reference Point"
            }
          ]
        },
        {
          queryPath: "leadEngineer",
          fields: [
            {
              fieldName: "orderedTotalRubberThickness",
              label: "Ordered Total Rubber Thickness",
              type: "number",
              required: true,
              unit: "mm"
            },
            {
              fieldName: "toleranceMinPercent",
              prepend: "Min",
              unit: "%",
              type: "Number"
            },
            {
              fieldName: "toleranceMin",
              prepend: "Tolerated Minimum",
              unit: "mm",
              math: "mathToleranceMin",
              type: "number"
            },
            {
              fieldName: "toleranceMaxPercent",
              prepend: "Max",
              unit: "%",
              type: "Number"
            },
            {
              fieldName: "toleranceMax",
              math: "mathToleranceMax",
              prepend: "Tolerated Maximum",
              unit: "mm",
              type: "number"
            }
          ]
        },

        {
          queryPath: "leadEngineer.rubberCements",
          delete: true,
          addButton: "Add Item Rubber Cement",
          fields: [
            {
              fieldName: "rubberCement",
              label: "Item Rubber Cement",
              notLabel: true
            }
          ]
        },
        {
          queryPath: "leadEngineer.vulcanizationSteps",
          repeatStartWith: 1,
          delete: true,
          addButton: "Add step",
          indexVariablePageTitle: 0,
          pageTitle: "Vulcanization {}",
          fields: [
            {
              fieldName: "vulcanizationOption",
              label: "Vulcanization Option",
              type: "select",
              required: true,
              options: [
                "Air Autoclave",
                "Heating Blankets",
                "Heating Cables",
                "Hot Air",
                "Steam Autoclave"
              ]
            },
            {
              fieldName: "programNumber",
              label: "Program Number",
              required: true,
              type: "Number"
            },
            {
              fieldName: "numberOfLayers",
              label: "Number of Layers",
              required: true,
              type: "Number",
              minInput: 0,
              maxInput: 30,
              notSingleEdit: true
            },
            {
              page: true,
              queryPath: "coatingLayers",

              repeatGroupWithQuery: [
                "leadEngineer.vulcanizationSteps",
                "data.numberOfLayers"
              ],
              fields: [
                {
                  fieldName: "layer",
                  label: "Layer",
                  math: "mathLayer",
                  isSubtitle: true,
                  indent: "true"
                },
                {
                  fieldName: "compoundNumber",
                  label: "Compound Number",
                  type: "select",
                  required: true,
                  options: [
                    "73165 3mm",
                    "73165 4mm",
                    "73165 6mm",
                    "73165 Strips",
                    "73185 3mm",
                    "73185 4mm",
                    "73185 6mm",
                    "73185 Strips",
                    "73585 3mm",
                    "73585 4mm",
                    "73585 6mm",
                    "73585 Strips",
                    "73529 3mm",
                    "73529 4mm",
                    "73529 6mm",
                    "73529 Strips",
                    "73780 3mm",
                    "73780 4mm",
                    "73780 6mm",
                    "73780 Strips",
                    "73785 3mm",
                    "73785 4mm",
                    "73785 6mm",
                    "73785 Strips",
                    "73815 3mm",
                    "73815 4mm",
                    "73815 6mm",
                    "73815 Strips",
                    "73915 3mm",
                    "73915 4mm",
                    "73915 6mm",
                    "73915 Strips",
                    "73961 3mm",
                    "73961 4mm",
                    "73961 6mm",
                    "73961 Strips",
                    "73982 3mm",
                    "73982 4mm",
                    "73982 6mm",
                    "73982 Strips",
                    "76027 3mm",
                    "76027 4mm",
                    "76027 6mm",
                    "76027 Strips",
                    "76159 3mm",
                    "76159 4mm",
                    "76159 6mm",
                    "76159 Strips",
                    "76183 3mm",
                    "76183 4mm",
                    "76183 6mm",
                    "76183 Strips",
                    "76187 3mm",
                    "76187 4mm",
                    "76187 6mm",
                    "76187 Strips",
                    "76198 3mm",
                    "76198 4mm",
                    "76198 6mm",
                    "76198 Strips",
                    "76207 3mm",
                    "76207 4mm",
                    "76207 6mm",
                    "76207 Strips",
                    "97500 3mm",
                    "97500 4mm",
                    "97500 6mm",
                    "97500 Strips",
                    "97520 3mm",
                    "97520 4mm",
                    "97520 6mm",
                    "97520 Strips",
                    "97522 3mm",
                    "9752 4mm",
                    "9752 6mm",
                    "9752 Strips"
                  ],
                  indent: "true"
                },
                {
                  fieldName: "appliedThickness",
                  label: "Applied Thickness",
                  unit: "mm",
                  decimal: 1,
                  type: "Number",
                  indent: "true"
                },
                {
                  fieldName: "shrink",
                  label: "Shrink",
                  unit: "%",
                  type: "Number",
                  default: 0,
                  indent: "true"
                },
                {
                  fieldName: "shrunkThickness",
                  label: "Shrunk Thickness",
                  math: "mathShrinkThickness",
                  type: "Number",
                  unit: "mm",
                  decimal: 1,
                  indent: "true"
                },
                {
                  fieldName: "layersUnique",
                  label: "Exclude layer from calculations",
                  type: "checkbox",
                  indent: "true"
                }
              ]
            }
          ]
        },
        {
          customComponent: "CustomLead"
        }
      ]
    },
    {
      showChapter: {
        slipon2: true,
        slipon3: true,
        b2P: true,
        dual: true
      },
      stageQueryPath: "leadEngineer.data.coatingVulcanization",
      pages: [
        {
          pageTitle: "Coating and Vulcanization",
          queryPath: "leadEngineer",
          fields: [
            {
              fieldName: "pipeOd",
              label: "Pipe OD",
              type: "select",
              options: [
                "2.375”",
                "2.875”",
                "3.5”",
                "4”",
                "4.5”",
                "5”",
                "5.5”",
                "6.625”",
                "7”",
                "7.625”",
                "8.625”",
                "9.625”",
                "10.75”",
                "11.75”",
                "11.875” ",
                "13.375” "
              ]
            },
            {
              fieldName: "threadType",
              label: "Thread type"
            },
            {
              fieldName: "materialType",
              label: "Material type"
            },
            {
              fieldName: "pipeEnds",
              label: " Pipe ends",
              type: "select",
              options: ["PXP", "BXP"]
            },
            {
              fieldName: "pipeLength",
              label: "Pipe length",
              type: "number",
              unit: "mm"
            },
            {
              label: "Identification Marking",
              math: "mathPipeDescription"
            },
            {
              fieldName: "elementLength",
              label: "Element length",
              required: true,
              type: "number",
              unit: "mm"
            },
            {
              fieldName: "MeasurementPoints",
              label: "Measurement points",
              math: "mathMeasurementPoints"
            },
            {
              showField: { dual: true },
              fieldName: "elementLengthPinSide",
              label: "Element length pin side",
              type: "number",
              required: true,
              unit: "mm"
            },
            {
              showField: { dual: true },
              fieldName: "measurementPointsPinSide",
              label: "Measurement points pin side",
              math: "mathMeasurementPointsPinSide"
            },
            {
              showField: { dual: true },
              fieldName: "elementLengthBoxSide",
              label: "Element length box side",
              type: "number",
              required: true,
              unit: "mm"
            },
            {
              showField: { dual: true },
              fieldName: "measurementPointsBoxSide",
              label: "Measurement points box side",
              math: "mathMeasurementPointsBoxSide"
            },
            {
              fieldName: "idDriftSize",
              required: true,
              label: "ID Drift size"
            },
            {
              fieldName: "rubberOd",
              label: "Rubber OD",
              required: true
            },
            {
              showField: { b2P: true },
              fieldName: "compoundNoRubberType",
              label: "Compound no/Rubber type",
              notCustom: true,
              required: true,
              type: "select",
              options: [
                "35-5265",
                "35-5265/5266",
                "35-5266",
                "35-4063",
                "35-4064",
                "35-4050",
                "12-3278"
              ]
            },
            {
              showField: { dual: true },
              fieldName: "compoundNoPinSide",
              label: "Compound no Pin side",
              required: true,
              notCustom: true,
              type: "select",
              options: ["35-4063", "35-5265", "35-4064", "35-5265/5266"]
            },
            {
              showField: { dual: true },
              fieldName: "compoundNoBoxSide",
              label: "Compound no box side",
              notCustom: true,
              required: true,
              type: "select",
              options: ["35-5265", "35-4064", "35-4063", "35-5265/5266"]
            },
            {
              showField: { slipon2: true, slipon3: true },
              fieldName: "compoundNoOd",
              label: "Compound no OD",
              notCustom: true,
              required: true,
              type: "select",
              options: [
                "35-5265",
                "35-5265/5266",
                "35-5266",
                "35-4063",
                "35-4064",
                "35-4050",
                "12-3278"
              ]
            },
            {
              showField: { slipon2: true, slipon3: true },
              fieldName: "compoundNoId",
              label: "Compound no ID",
              math: "mathCompoundNoId"
            },
            {
              fieldName: "coreSampleCode",
              label: "Core sample code",
              required: true,
              math: "mathCoreSampleCode"
            },
            {
              fieldName: "packingSpecification",
              label: "Packing specification",
              required: true,
              math: "mathPackingSpecification"
            },
            {
              showField: { b2P: true, dual: true },
              fieldName: "cable",
              notSingleEdit: true,
              label: "Cable",
              type: "checkbox"
            },
            {
              showField: { b2P: true, dual: true },
              fieldName: "numberOfTracks",
              label: "Number of tracks",
              type: "Number",
              writeOnlyFieldIf: "leadEngineer.data.cable"
            }
          ]
        },
        {
          queryPath: "leadEngineer.ringMaterials",
          delete: true,
          repeatStartWith: 1,
          addButton: "Add ring material no.",
          fields: [
            {
              fieldName: "ringType",
              label: "Ring type",
              required: true,
              type: "select",
              options: ["End ring", "Center ring"]
            },
            {
              fieldName: "ringMaterial",
              queryVariableLabel: [
                "leadEngineer.ringMaterials",
                "data.ringType"
              ],
              required: true,
              label: "{} material no."
            }
          ]
        },
        {
          queryPath: "leadEngineer",
          fields: [
            {
              fieldName: "K2",
              label: "K2",
              type: "checkbox"
            },
            {
              fieldName: "screwMaterialType",
              label: "Screw material type",
              required: true,
              type: "select",
              options: ["Black 10.9", "Black 10.9/A4", "Inc718", "Inc625"]
            },
            {
              fieldName: "screwSize",
              label: "Screw size",
              type: "select",
              required: true,
              options: ["M10", "M16"]
            },
            {
              fieldName: "screwLength",
              label: "Screw length",
              required: true,
              type: "select",
              options: [
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30
              ]
            },
            {
              fieldName: "screwDescription",
              label: "Screw description",
              math: "mathScrewDescription"
            },
            {
              showField: { b2P: true, slipon2: true, slipon3: true },
              fieldName: "barrier",
              label: "Barrier",
              notCustom: true,
              required: true,
              type: "select",
              options: [...barrierOptions]
            },
            {
              showField: { b2P: true, slipon2: true, slipon3: true },
              fieldName: "increasedOdForWholeElementTotal",
              label: "Increased OD for Whole element Total",
              math: "mathIncreasedOdForWholeElementTotal0"
            },
            {
              showField: { b2P: true, slipon2: true, slipon3: true },
              fieldName: "increasedOdForWholeElement",
              label: "Increased OD for Whole element",
              math: "mathIncreasedOdForWholeElement0"
            },
            {
              showField: { b2P: true, slipon2: true, slipon3: true },
              fieldName: "increasedOdForEndsTotal",
              label: "Increased OD for Ends Total",
              math: "mathIncreasedOdForEndsTotal0"
            },
            {
              showField: { b2P: true, slipon2: true, slipon3: true },
              fieldName: "increasedOdForEnds",
              label: "Increased OD for Ends",
              math: "mathIncreasedOdForEnds0"
            },
            {
              showField: { dual: true },
              fieldName: "barrierPinSide",
              label: "Barrier pin side",
              notCustom: true,
              required: true,
              type: "select",
              options: [...barrierOptions]
            },
            {
              showField: { dual: true },
              fieldName: "increasedOdForWholeElementTotal1",
              label: "Increased OD for Whole element Total",
              math: "mathIncreasedOdForWholeElementTotal1"
            },
            {
              showField: { dual: true },
              fieldName: "increasedOdForWholeElement1",
              label: "Increased OD for Whole element",
              math: "mathIncreasedOdForWholeElement1"
            },
            {
              showField: { dual: true },
              fieldName: "increasedOdForEndsTotal1",
              label: "Increased OD for Ends Total",
              math: "mathIncreasedOdForEndsTotal1"
            },
            {
              showField: { dual: true },
              fieldName: "increasedOdForEnds1",
              label: "Increased OD for Ends",
              math: "mathIncreasedOdForEnds1"
            },
            {
              fieldName: "barrierBoxSide",
              label: "Barrier box side",
              required: true,
              notCustom: true,
              showField: { dual: true },
              type: "select",
              options: [...barrierOptions]
            },
            {
              fieldName: "increasedOdForWholeElementTotal2",
              label: "Increased OD for Whole element Total",
              showField: { dual: true },
              math: "mathIncreasedOdForWholeElementTotal2"
            },
            {
              fieldName: "increasedOdForWholeElement2",
              label: "Increased OD for Whole element",
              showField: { dual: true },
              math: "mathIncreasedOdForWholeElement2"
            },
            {
              fieldName: "increasedOdForEndsTotal2",
              label: "Increased OD for Ends Total",
              showField: { dual: true },
              math: "mathIncreasedOdForEndsTotal2"
            },
            {
              fieldName: "increasedOdForEnds2",
              label: "Increased OD for Ends",
              showField: { dual: true },
              math: "mathIncreasedOdForEnds2"
            },
            {
              fieldName: "description",
              label: "Description",
              math: "mathDescription"
            },
            {
              showField: { b2P: true, slipon2: true, slipon3: true },
              fieldName: "ultrasound",
              label: "Ultrasound",
              type: "checkbox",
              default: true
            },
            {
              showField: { dual: true },
              fieldName: "ultrasoundPinSide",
              label: "Ultrasound pin side",
              type: "checkbox",
              default: true
            },
            {
              showField: { dual: true },
              fieldName: "ultrasoundBoxSide",
              label: "Ultrasound box side",
              type: "checkbox",
              default: true
            }
          ]
        },
        {
          queryPath: "leadEngineer.vulcanizationSteps",
          repeatStartWith: 1,
          delete: true,
          addButton: "Add step",
          indexVariablePageTitle: 0,
          pageTitle: "Vulcanization {}",
          fields: [
            {
              fieldName: "vulcanizationOption",
              label: "Vulcanization Option",
              type: "select",
              required: true,
              options: ["Hot Air", "Steam Autoclave"]
            },
            {
              fieldName: "programNumber",
              label: "Program Number",
              math: "mathProgramNumber",
              type: "Number"
            }
          ]
        }
      ]
    },
    {
      stageQueryPath: "leadEngineer.data.finalInspection",
      pages: [
        {
          pageTitle: "Final Inspection",
          queryPath: "leadEngineer",
          fields: [
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "numberOfHardnessOfOuterLayer",
              label: "Number of Hardness of Outer Layer",
              type: "number"
            },
            {
              writeOnlyFieldIf:
                "leadEngineer.data.numberOfHardnessOfOuterLayer",
              fieldName: "hardnessOfOuterLayer",
              label: "Hardness of Outer Layer",
              unit: "Shore A",
              prepend: "Min"
            },
            {
              showField: {
                slipon2: true,
                slipon3: true,
                b2P: true,
                dual: true
              },
              fieldName: "asBuilt",
              label: "As built",
              notSingleEdit: true,
              type: "select",
              options: [
                "None",
                "Swell packer standard",
                "Swell packer standard with 1 center ring",
                "Swell packer K2 with 2 center ringer",
                "Swell packer K2 with 1 center ring",
                "Swell packer K2 standard",
                "Swell packer Cable standard",
                "Swell packer Cable with 1 center ring",
                "Swell packer Cable with 2 center ring"
              ]
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "totalLength",
              label: "Total length",
              subtext: "Dwg Ref. L1"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "totalLengthPinMakeUpLoss",
              label: "Total length - Pin make up loss",
              subtext: "Dwg Ref. L1 - Thread"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "handlingSpacePinEnd",
              label: "Handling space pin end",
              subtext: "Dwg Ref. L2",
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "handlingSpacePinEndMin",
              prepend: "Min",
              type: "number",
              unit: "mm",
              default: 0
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "handlingSpacePinEndMax",
              prepend: "Max",
              type: "number",
              unit: "mm",
              default: 25
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "handlingSpaceBoxEnd",
              label: "Handling space box end",
              subtext: "Dwg Ref. L3",
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "handlingSpaceBoxEndMin",
              prepend: "Min",
              type: "number",
              unit: "mm",
              default: 0
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "handlingSpaceBoxEndMax",
              prepend: "Max",
              type: "number",
              unit: "mm",
              default: 25
            },
            {
              writeOnlyFieldIf: {
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
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard"
                ]
              },
              fieldName: "packerElementLengthMin",
              prepend: "Min",
              type: "number",
              unit: "mm",
              default: 50
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard"
                ]
              },
              fieldName: "packerElementLengthMax",
              prepend: "Max",
              type: "number",
              unit: "mm",
              default: 50
            },
            {
              writeOnlyFieldIf: {
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
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 2 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 with 2 center ringer"
                ]
              },
              fieldName: "packerElementLengthTotalMin",
              prepend: "Min",
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 2 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 with 2 center ringer"
                ]
              },
              fieldName: "packerElementLengthTotalMax",
              prepend: "Max",
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
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
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring"
                ]
              },
              fieldName: "packerElementLength1Min",
              prepend: "Min",
              type: "number",
              unit: "mm",
              default: 50
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring"
                ]
              },
              fieldName: "packerElementLength1Max",
              prepend: "Max",
              type: "number",
              unit: "mm",
              default: 50
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring"
                ]
              },
              fieldName: "packerElementLength2",
              label: "Packer element length #2",
              subtext: "Dwg Ref. L4.2",
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring"
                ]
              },
              fieldName: "packerElementLength2Min",
              prepend: "Min",
              type: "number",
              unit: "mm",
              default: 50
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring"
                ]
              },
              fieldName: "packerElementLength2Max",
              prepend: "Max",
              type: "number",
              unit: "mm",
              default: 50
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 2 center ring",
                  "Swell packer K2 with 2 center ringer"
                ]
              },
              fieldName: "packerElementLength3",
              label: "Packer element length #3",
              subtext: "Dwg Ref. L4.3",
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 2 center ring",
                  "Swell packer K2 with 2 center ringer"
                ]
              },
              fieldName: "packerElementLength3Min",
              prepend: "Min",
              type: "number",
              unit: "mm",
              default: 50
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable with 2 center ring",
                  "Swell packer K2 with 2 center ringer"
                ]
              },
              fieldName: "packerElementLength3Max",
              prepend: "Max",
              type: "number",
              unit: "mm",
              default: 50
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "basePipeOd",
              label: "Base pipe OD",
              subtext: "Dwg Ref. D1"
            },
            {
              writeOnlyFieldIf: {
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
              fieldName: "packerElementOd1",
              label: "Packer element OD #1",
              subtext: "Dwg Ref. D2",
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
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
              fieldName: "packerElementOd1Min",
              prepend: "Min",
              type: "number",
              unit: "mm",
              default: 1
            },
            {
              writeOnlyFieldIf: {
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
              fieldName: "packerElementOd1Max",
              prepend: "Max",
              type: "number",
              unit: "mm",
              default: 0
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "packerElementOd2",
              label: "Packer element OD #2",
              subtext: "Dwg Ref. D3",
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "packerElementOd2Min",
              prepend: "Min",
              type: "number",
              unit: "mm",
              default: 1
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "packerElementOd2Max",
              prepend: "Max",
              type: "number",
              unit: "mm",
              default: 0
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "packerElementOd3",
              label: "Packer element OD #3",
              subtext: "Dwg Ref. D4",
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "packerElementOd3Min",
              prepend: "Min",
              type: "number",
              unit: "mm",
              default: 1
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "packerElementOd3Max",
              prepend: "Max",
              type: "number",
              unit: "mm",
              default: 0
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "endRingOd",
              label: "End-ring OD",
              subtext: "Dwg Ref. D2",
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "endRingOdMin",
              prepend: "Min",
              type: "number",
              unit: "mm",
              default: 0.2
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "endRingOdMax",
              prepend: "Max",
              type: "number",
              unit: "mm",
              default: 0.2
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "endRingLength",
              label: "End-ring Length",
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "endRingLengthMin",
              prepend: "Min",
              default: 0.25,
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "endRingLengthMax",
              prepend: "Max",
              default: 0.25,
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "centerRingOd",
              label: "Center-ring OD",
              subtext: "Dwg Ref. D3",
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "centerRingOdMin",
              prepend: "Min",
              type: "number",
              unit: "mm",
              default: 0.2
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "centerRingOdMax",
              prepend: "Max",
              type: "number",
              unit: "mm",
              default: 0.2
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "centerRingLength",
              label: "Center-ring Length",
              type: "number",
              unit: "mm"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "centerRingLengthMin",
              prepend: "Min",
              type: "number",
              unit: "mm",
              default: 0.25
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "centerRingLengthMax",
              prepend: "Max",
              type: "number",
              unit: "mm",
              default: 0.25
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "couplingLength",
              label: "Coupling length"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "controlLine1",
              label: "Control line #1",
              subtext: "Dwg Ref. CL1"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "controlLine2",
              label: "Control line #2",
              subtext: "Dwg Ref. CL2"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "controlLine3",
              label: "Control line #3",
              subtext: "Dwg Ref. CL3"
            },
            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "controlLine4",
              label: "Control line #4",
              subtext: "Dwg Ref. CL4"
            },

            {
              writeOnlyFieldIf: {
                "leadEngineer.data.asBuilt": [
                  "Swell packer standard",
                  "Swell packer standard with 1 center ring",
                  "Swell packer K2 with 2 center ringer",
                  "Swell packer K2 with 1 center ring",
                  "Swell packer K2 standard",
                  "Swell packer Cable standard",
                  "Swell packer Cable with 1 center ring",
                  "Swell packer Cable with 2 center ring"
                ]
              },
              fieldName: "custom",
              label: "Custom (Others)"
            },

            {
              showField: { slipon2: true, slipon3: true },
              fieldName: "elementLengthFinalInspection",
              label: "Element length"
            },
            {
              showField: { slipon2: true, slipon3: true },
              fieldName: "elementOd",
              label: "Element OD"
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "identificationMarking",
              label: "Identification Marking"
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "numberOfPeelTest",
              label: "Number of Peel Test",
              type: "number"
            },
            {
              writeOnlyFieldIf: "leadEngineer.data.numberOfPeelTest",
              fieldName: "peelTest",
              label: "Peel Test",
              unit: "N/25mm",
              prepend: "Min",
              subtext: "ISO 813 bS6374-5"
            },
            {
              showField: {
                mould: true
              },
              fieldName: "totalCoatingThickness",
              label: "Total Coating Thickness",
              type: "checkbox",
              subtext: "See ITP."
            },
            {
              fieldName: "visualInspection",
              label: "Visual Inspection",
              type: "checkbox",
              default: {
                slipon3: true,
                slipon2: true,
                b2P: true,
                dual: true,
                coatedItem: false,
                mould: false
              },
              subtext: "See ITP."
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "sparkTest",
              label: "Spark Test",
              type: "checkbox",
              subtext: "See ITP."
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "hammerTest",
              label: "Hammer Test",
              type: "checkbox",
              subtext: "See ITP."
            },
            {
              showField: { coatedItem: true, mould: true },
              fieldName: "simpleFinalDimensionsCheck",
              label: "Simple Final Dimensions Check",
              type: "checkbox",
              subtext: "See ITP."
            }
          ]
        },
        {
          showPage: { coatedItem: true, mould: true },
          queryPath: "leadEngineer.finalInspectionDimensionsChecks",
          delete: true,
          addButton: "Advanced Final Dimensions Check",
          fields: [
            {
              fieldName: "finalDimensionsReference",
              label: "Final Dimensions Reference"
            },
            {
              fieldName: "finalDimensionsMin",
              prepend: "Min",
              unit: "mm",
              type: "Number"
            },
            {
              fieldName: "finalDimensionsMax",
              prepend: "Max",
              unit: "mm",
              type: "Number"
            }
          ]
        },
        {
          queryPath: "leadEngineer.finalInspectionCustomTests",
          delete: true,
          addButton: "Custom Test",
          fields: [
            {
              fieldName: "name",
              label: "Custom Test",
              prepend: "Name"
            },
            {
              fieldName: "criteria",
              prepend: "Criteria"
            }
          ]
        }
      ]
    }
  ]
};
