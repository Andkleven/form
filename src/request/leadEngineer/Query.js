import gql from "graphql-tag";

const ALL = gql`
  query($id: Int!) {
    createProject(id: $id) {
      id
      data
      leadEngineerDone
      operatorDone
      qualityControlDone
      operatorStarted
      category {
        id
        data
        item {
          id
          data
          different
          qrCode
          repair
          operatorDone
          qualityControlDone
          leadEngineer {
            id
            data
            measurementPointActualTvd {
              id
              data
            }
            customSteelPreparation {
              id
              data
            }
            rubberCement {
              id
              data
            }
            customFinalInspection {
              id
              data
            }
            vulcanizationStep {
              id
              data
            }
            coatingLayer {
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
    createProject(qualityControlDone: false) {
      id
      data
    }
  }
`;

const GET_GEOMETRY = gql`
  query($id: Int!) {
    category(id: $id) {
      data
    }
  }
`;

const GET_ORDER_GEOMETRY = gql`
  query($id: Int!) {
    createProject(id: $id) {
      id
      data
      category {
        id
        data
        item {
          id
          data
          different
        }
        uploadFile {
          id
          file
          data
        }
      }
    }
  }
`;

const GET_LEAD_ENGINEER = gql`
  query getLeadEngineer($id: Int!) {
    leadEngineer(item: $id) {
      id
      data
      customSteelPreparation {
        id
        data
      }
      measurementPointActualTvd {
        id
        data
      }
      vulcanizationStep {
        id
        data
      }
      coatingLayer {
        id
        data
      }
      rubberCement {
        id
        data
      }
      customFinalInspection {
        id
        data
      }
    }
  }
`;

const GET_OPERATOR = gql`
  query($id: Int!) {
    category(id: $id) {
      id
      data
      item {
        id
        data
        leadEngineer {
          id
          data
          measurementPointActualTvd {
            id
            data
          }
          customSteelPreparation {
            id
            data
          }
          rubberCement {
            id
            data
          }
          customFinalInspection {
            id
            data
          }
          vulcanizationStep {
            id
            data
          }
          coatingLayer {
            id
            data
          }
        }
        operator {
          id
          data
          customMediaBlasting {
            id
            data
          }
          coating {
            id
            data
            mixDate {
              id
              data
            }
            measurementPoint {
              id
              data
            }
          }
          vulcanization {
            id
            data
          }
        }
      }
    }
  }
`;

const OPERATOR_PROJECTS = gql`
  query($leadEngineerDone: Boolean, $operatorDone: Boolean) {
    createProject(
      leadEngineerDone: $leadEngineerDone
      operatorDone: $operatorDone
    ) {
      data
      category {
        data
        item {
          id
          data
        }
      }
    }
  }
`;

const query = {
  ALL,
  GET_ORDER_GEOMETRY,
  GET_LEAD_ENGINEER,
  GET_GEOMETRY,
  GET_ORDER,
  GET_OPERATOR,
  OPERATOR_PROJECTS
};
export default query;
