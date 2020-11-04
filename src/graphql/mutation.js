import gql from "graphql-tag";

const ORDER = gql`
  mutation projects($projects: [ProjectInput]) {
    projects(projects: $projects) {
      new {
        id
        data
        leadEngineerDone
        descriptions {
          id
          data
          specifications {
            id
            data
          }
          items {
            id
            itemId
            unique
            leadEngineer {
              id
              data
              measurementPointActualTdvs {
                id
                data
              }
              rubberCements {
                id
                data
              }
              ringMaterials {
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
              vulcanizationSteps {
                id
                data
                coatingLayers {
                  id
                  data
                }
              }
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
    $deleteSeen: Boolean
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
      deleteSeen: $deleteSeen
      foreignKey: $foreignKey
    ) {
      new {
        id
        itemId
        unique
        qrCode
        repair
        stage
        leadEngineer {
          id
          data
        }
        seen {
          seen
        }
      }
    }
  }
`;

const LEAD_ENGINEER = gql`
  mutation leadEngineer(
    $leadEngineer: LeadEngineerInput
    $descriptionId: Int
    $itemId: Int
    $itemIdList: [Int]
  ) {
    leadEngineer(
      leadEngineer: $leadEngineer
      descriptionId: $descriptionId
      itemId: $itemId
      itemIdList: $itemIdList
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
        ringMaterials {
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
  mutation projects($projects: [ProjectInput]) {
    projects(projects: $projects) {
      new {
        leadEngineerDone
      }
    }
  }
`;

const OPERATOR_BATCHING = gql`
  mutation operatorsBaching(
    $operator: OperatorBachingInput
    $vulcanizationOperators: [UnderCategoriesOfLeadEngineerInput]
    $itemIdList: [String]!
    $stages: [String]
  ) {
    operatorsBaching(
      operator: $operator
      vulcanizationOperators: $vulcanizationOperators
      itemIdList: $itemIdList
      stages: $stages
    ) {
      batching {
        id
        data
        descriptions {
          id
          data
          specifications {
            id
            data
          }
          items {
            id
            itemId
            stage
            operator {
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
              measurementPointBeforeBarriers {
                id
                data
              }
              measurementPointAfterBarriers {
                id
                data
              }
              measurementPointBeforeBarrierPinSides {
                id
                data
              }
              measurementPointBeforeBarrierBoxSides {
                id
                data
              }
              measurementPointAfterBarrierPinSides {
                id
                data
              }
              measurementPointAfterBarrierBoxSides {
                id
                data
              }
              measurementPointCompletionPhases {
                id
                data
              }
              grindings {
                id
                data
              }
              deviationPinSides {
                id
                data
              }
              deviationBoxSides {
                id
                data
              }
              deviations {
                id
                data
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
            }
          }
        }
      }
    }
  }
`;

const OPERATOR = gql`
  mutation operator(
    $operator: OperatorInput
    $stage: String
    $itemId: Int
    $itemIdList: [Int]
  ) {
    operator(
      operator: $operator
      stage: $stage
      itemId: $itemId
      itemIdList: $itemIdList
    ) {
      new {
        item {
          id
          stage
          itemId
          unique
          qrCode
          repair
          leadEngineer {
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
            ringMaterials {
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
          operator {
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
            measurementPointBeforeBarriers {
              id
              data
            }
            measurementPointAfterBarriers {
              id
              data
            }
            measurementPointBeforeBarrierPinSides {
              id
              data
            }
            measurementPointBeforeBarrierBoxSides {
              id
              data
            }
            measurementPointAfterBarrierPinSides {
              id
              data
            }
            measurementPointAfterBarrierBoxSides {
              id
              data
            }
            measurementPointCompletionPhases {
              id
              data
            }
            grindings {
              id
              data
            }
            deviationPinSides {
              id
              data
            }
            deviationBoxSides {
              id
              data
            }
            deviations {
              id
              data
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
          finalInspectionQualityControl {
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

const QUALITY_CONTROL = gql`
  mutation finalInspectionQualityControl(
    $finalInspectionQualityControl: FinalInspectionQualityControlInput
    $itemId: Int
    $stage: String
    $itemIdList: [Int]
  ) {
    finalInspectionQualityControl(
      finalInspectionQualityControl: $finalInspectionQualityControl
      itemId: $itemId
      stage: $stage
      itemIdList: $itemIdList
    ) {
      new {
        item {
          id
          stage
          itemId
          unique
          qrCode
          repair
          leadEngineer {
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
            ringMaterials {
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
          operator {
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
            measurementPointBeforeBarriers {
              id
              data
            }
            measurementPointAfterBarriers {
              id
              data
            }
            measurementPointBeforeBarrierPinSides {
              id
              data
            }
            measurementPointBeforeBarrierBoxSides {
              id
              data
            }
            measurementPointAfterBarrierPinSides {
              id
              data
            }
            measurementPointAfterBarrierBoxSides {
              id
              data
            }
            measurementPointCompletionPhases {
              id
              data
            }
            grindings {
              id
              data
            }
            deviationPinSides {
              id
              data
            }
            deviationBoxSides {
              id
              data
            }
            deviations {
              id
              data
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
          finalInspectionQualityControl {
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

const VERIFY_TOKEN = gql`
  mutation verifyToken($token: String) {
    verifyToken(token: $token) {
      payload
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
  DELETE_SEEN,
  VERIFY_TOKEN
};

export default mutations;
