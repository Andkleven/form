import gql from "graphql-tag";

const ALL = gql`
  query($id: Int!) {
    createProject(id: id) {
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

const query = {
  ALL,
  GET_ORDER_GEOMETRY,
  GET_LEAD_ENGINEER,
  GET_GEOMETRY,
  GET_ORDER
};
export default query;
