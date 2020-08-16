import gql from "graphql-tag";

const ORDER = gql`
  mutation projects($projects: [ProjectInput]) {
    projects(projects: $projects) {
      new {
        id
        data
        leadEngineerDone
        itpDocumentNumbers {
          id
          data
        }
        descriptions {
          id
          data
          items {
            id
            itemId
            unique
            leadEngineers {
              id
             }
          }
          uploadFiles {
            id
            file
            fileDescription
          }
        }
      }
    }
  }
`;

const DELETE_PROJECT = gql`
  mutation projectDelete($id: Int) {
    projectDelete(id: $id) {
      deleted
    }
  }
`;

const DELETE_ITEM = gql`
  mutation itemDelete($id: Int) {
    itemDelete(id: $id) {
      deleted
    }
  }
`;

const ITEM = gql`
  mutation item(
    $id: Int
    $itemId: String
    $unique: Boolean
    $qrCode: String
    $repair: Boolean
    $stage: String
    $seen: [String]
    $foreignKey: Int
  ) {
    item(
      id: $id
      itemId: $itemId
      stage: $stage
      unique: $unique
      qrCode: $qrCode
      repair: $repair
      seen: $seen
      foreignKey: $foreignKey
    ) {
      new {
        id
        itemId
        unique
        qrCode
        repair
        stage
        leadEngineers {
          id
         }
        seen {
          seen
        }
      }
    }
  }
`;

const LEAD_ENGINEER = gql`
  mutation leadEngineers(
    $leadEngineers: [LeadEngineerInput]
    $descriptionId: Int
    $itemId: Int
  ) {
    leadEngineers(
      leadEngineers: $leadEngineers
      descriptionId: $descriptionId
      itemId: $itemId
    ) {
      new {
        id
        data
        measurementPointActualTdvs {
          id
          data
        }
        additionalCustomTests {
          id
          data
        }
        finalInspectionCustomTests {
          id
          data
        }
        finalInspectionDimensionsChecks {
          id
          data
        }
        rubberCements {
          id
          data
        }
        vulcanizationSteps {
          id
          data
          coatingLayers {
            id
            data
            cumulativeThickness {
              id
              data
            }
          }
        }
      }
    }
  }
`;

const LEAD_ENGINEER_DONE = gql`
  mutation projects($project: [ProjectInput]) {
    projects(project: $project) {
      new {
        leadEngineerDone
      }
    }
  }
`;

const OPERATOR_BATCHING = gql`
  mutation operatorsBaching(
    $operators: [OperatorBachingInput]
    $vulcanizationOperators: [UnderCategoriesOfLeadEngineerInput]
    $itemIdList: [Int]!
    $stage: String
  ) {
    operatorsBaching(
      operators: $operators
      vulcanizationOperators: $vulcanizationOperators
      itemIdList: $itemIdList
      stage: $stage
    ) {
      batching {
        id
        data
        descriptions {
          id
          data
          items {
            id
            itemId
            stage
            operators {
              id
              data
              additionalCustomTestOperators {
                id
                data
              }
              vulcanizationOperators {
                id
                data
              }
            }
          }
        }
      }
    }
  }
`;

const OPERATOR = gql`
  mutation operators(
    $operators: [OperatorInput]
    $stage: String
    $itemId: Int
  ) {
    operators(operators: $operators, stage: $stage, itemId: $itemId) {
      new {
        item {
          id
          itemId
          stage
          operators {
            id
            data
            surfaceCleanlinessImage
            measurementPointActualTdvs {
              id
              data
            }
            additionalCustomTestOperators {
              id
              data
            }
            rubberCementOperators {
              id
              data
              mixDates {
                id
                data
              }
            }
            vulcanizationOperators {
              id
              data

              coatingOperators {
                id
                data
                layers {
                  id
                  data
                }
                measurementPointOperators {
                  id
                  data
                }
              }
              measurementPointOperators {
                id
                data
              }
            }
          }
        }
      }
    }
  }
`;

const QUALITY_CONTROL = gql`
  mutation finalInspectionQualityControls(
    $finalInspectionQualityControls: [FinalInspectionQualityControlInput]
    $itemId: Int
    $stage: String
  ) {
    finalInspectionQualityControls(
      finalInspectionQualityControls: $finalInspectionQualityControls
      itemId: $itemId
      stage: $stage
    ) {
      new {
        item {
          id
          itemId
          unique
          qrCode
          repair
          stage
          leadEngineers {
            id
            data
            measurementPointActualTdvs {
              id
              data
            }
            vulcanizationSteps {
              id
              data
              coatingLayers {
                id
                data
                cumulativeThickness {
                  id
                  data
                }
              }
            }
            rubberCements {
              id
              data
            }
            additionalCustomTests {
              id
              data
            }
            finalInspectionCustomTests {
              id
              data
            }
            finalInspectionDimensionsChecks {
              id
              data
            }
          }
          operators {
            id
            data
            surfaceCleanlinessImage
            rubberCementOperators {
              id
              data
              mixDates {
                id
                data
              }
            }
            measurementPointActualTdvs {
              id
              data
            }
            vulcanizationOperators {
              id
              data
              coatingOperators {
                id
                data
                layers {
                  id
                  data
                }
                measurementPointOperators {
                  id
                  data
                }
              }
              measurementPointOperators {
                id
                data
              }
            }
            additionalCustomTestOperators {
              id
              data
            }
          }
          finalInspectionQualityControls {
            id
            data
            measurementPointQualityControls {
              id
              data
            }
            hardnessQualityControls {
              id
              data
            }
            peelTestQualityControls {
              id
              data
            }
            finalInspectionCustomTestQualityControls {
              id
              data
            }
            finalInspectionDimensionsCheckQualityControls {
              id
              data
            }
            uploadFiles {
              id
              file
              fileDescription
            }
          }
        }
      }
    }
  }
`;

const DELETE_SEEN = gql`
  mutation item($id: Int, $deleteSeen: Boolean) {
    item(id: $id, deleteSeen: $deleteSeen) {
      new {
        id
        seen {
          id
          seen
        }
      }
    }
  }
`;

const mutations = {
  ORDER,
  DELETE_PROJECT,
  DELETE_ITEM,
  ITEM,
  LEAD_ENGINEER,
  LEAD_ENGINEER_DONE,
  OPERATOR_BATCHING,
  OPERATOR,
  QUALITY_CONTROL,
  DELETE_SEEN
};

export default mutations;
