import gql from "graphql-tag";

const ITEM = gql`
  query($id: Int) {
    items(id: $id) {
      id
      itemId
      unique
      qrCode
      repair
      stage
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
            cumulativeThickness {
              id
              data
            }
          }
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
`;

const BATCHING_OPERATOR = gql`
  query($id: Int) {
    projects(id: $id) {
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
          qrCode
          repair
          stage
          leadEngineer {
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
            ringMaterials {
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
          operator {
            id
            data
            additionalCustomTestOperators {
              id
              data
            }
          }
        }
      }
    }
  }
`;

const BATCHING_VULCANIZATION = gql`
  query($id: Int) {
    projects(id: $id) {
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
          qrCode
          repair
          stage
          leadEngineer {
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
            ringMaterials {
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
          operator {
            vulcanizationOperators {
              id
              data
            }
          }
        }
      }
    }
  }
`;

const GET_ORDER = gql`
  {
    projects(qualityControlDone: false) {
      id
      data
    }
  }
`;

const GET_GEOMETRY = gql`
  query($id: Int) {
    descriptions(id: $id) {
      data
    }
  }
`;

const GET_ORDER_GEOMETRY = gql`
  query($id: Int) {
    projects(id: $id) {
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
`;

const GET_LEAD_ENGINEER = gql`
  query getLeadEngineer($id: Int) {
    items(id: $id) {
      id
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
    }
  }
`;

const GET_OPERATOR_BY_DESCRIPTION = gql`
  query($id: Int) {
    descriptions(id: $id) {
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
              cumulativeThickness {
                id
                data
              }
            }
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
`;

const GET_OPERATOR_BY_ITEM = gql`
  query($id: Int) {
    items(id: $id) {
      id
      itemId
      unique
      qrCode
      repair
      stage
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
`;

const OPERATOR_PROJECTS = gql`
  query($leadEngineerDone: Boolean, $orderByLatestProject: Boolean) {
    projects(
      leadEngineerDone: $leadEngineerDone
      orderByLatestProject: $orderByLatestProject
    ) {
      leadEngineerDone
      data
      id
      descriptions {
        id
        data
        specifications {
          id
          data
        }
        items {
          stage
          id
          itemId
          seen {
            id
            seen
          }
        }
      }
    }
  }
`;

const QUALITY_CONTROL = gql`
  query($id: Int) {
    items(id: $id) {
      id
      itemId
      unique
      qrCode
      repair
      stage
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
            cumulativeThickness {
              id
              data
            }
          }
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
`;

const USERS = gql`
  query($role: [String]) {
    userProfile(role: $role) {
      id
      name
      role
    }
  }
`;

const DEFAULT = gql`
  query($name: String) {
    query(name: $name) {
      id
    }
  }
`;

const REPORT = gql`
  query($id: Int) {
    items(id: $id) {
      id
      itemId
      unique
      qrCode
      repair
      stage
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
            cumulativeThickness {
              id
              data
            }
          }
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
`;

const query = {
  ITEM,
  BATCHING_OPERATOR,
  BATCHING_VULCANIZATION,
  GET_ORDER_GEOMETRY,
  GET_LEAD_ENGINEER,
  GET_GEOMETRY,
  GET_ORDER,
  GET_OPERATOR_BY_DESCRIPTION,
  GET_OPERATOR_BY_ITEM,
  OPERATOR_PROJECTS,
  QUALITY_CONTROL,
  USERS,
  DEFAULT,
  REPORT
};

export default query;
